import CompilerWorker from 'solid-repl/repl/compiler?worker';
import FormatterWorker from 'solid-repl/repl/formatter?worker';
import LinterWorker from 'solid-repl/repl/linter?worker';
import { createEffect, createSignal, lazy, Show } from 'solid-js';
import { useLocation, useNavigate } from '@solidjs/router';
import { useAppContext } from '../context';
import { debounce } from '@solid-primitives/scheduled';
import { decompressFromURL } from '@amoutonbrady/lz-string';
import { defaultTabs, isSolidV2 } from 'solid-repl/src';
import type { ReplStorage, Tab } from 'solid-repl';
import { Header } from '../components/header';
import { css } from 'styled-system/css';
import { normalizeSolidVersion } from '../solidVersion';
import { EXAMPLE_FILE, OTHER_VARIANT, dialectFor, findExample, loadExample, type ExampleVariant } from '../examples';

function parseHash<T>(hash: string, fallback: T): T {
  try {
    return JSON.parse(decompressFromURL(hash) || '');
  } catch {
    return fallback;
  }
}

function readJson<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {}
}

const Repl = lazy(() => import('solid-repl/src/repl'));

const exampleErrorStyles = css({ px: 4, py: 2, fontSize: 'sm', color: 'red.700', _dark: { color: 'red.300' } });

interface InternalTab extends Tab {
  _source: string;
  _name: string;
}

const SCRATCHPAD_KEY = 'scratchpad';

export const Edit = () => {
  const compiler = new CompilerWorker();
  const formatter = new FormatterWorker();
  const linter = new LinterWorker();

  const context = useAppContext()!;
  const navigate = useNavigate();
  const location = useLocation();

  for (const key of Object.keys(localStorage)) {
    if (key.startsWith('solid-repl:editorState:file:///')) safeRemove(key);
  }

  const replStorage: ReplStorage = {
    getLayout: () => readJson('solid-repl:layout'),
    setLayout: (layout) => writeJson('solid-repl:layout', layout),
    getEditorState: (fileId) => readJson(`solid-repl:editorState:${fileId}`),
    setEditorState: (fileId, state) => {
      const key = `solid-repl:editorState:${fileId}`;
      if (state) writeJson(key, state);
      else safeRemove(key);
    },
  };

  const mapTabs = (toMap: (Tab | InternalTab)[]): InternalTab[] =>
    toMap.map((tab) => {
      if ('_source' in tab) return tab;
      return {
        _name: tab.name,
        get name() {
          return this._name;
        },
        set name(name: string) {
          this._name = name;
          persist();
        },
        _source: tab.source,
        get source() {
          return this._source;
        },
        set source(source: string) {
          this._source = source;
          persist();
        },
      };
    });

  const [tabs, trueSetTabs] = createSignal<InternalTab[]>([]);
  const setTabs = (tabs: (Tab | InternalTab)[]) => trueSetTabs(mapTabs(tabs));

  const persist = debounce(() => {
    writeJson(SCRATCHPAD_KEY, { files: tabs().map((tab) => ({ name: tab.name, content: tab.source })) });
  }, 10);

  const storedVersion = normalizeSolidVersion(localStorage.getItem('solidVersion'));
  const [solidVersion, setSolidVersion] = createSignal(storedVersion);

  // Which example the tab currently holds, and which of its two variants,
  // remembered so a reload does not show an example's code next to an empty
  // picker or a button labelled for the wrong direction. Any hand edit
  // invalidates both.
  const EXAMPLE_KEY = 'solid-playground:example';
  const storedExample = readJson<{ rule: string; variant: ExampleVariant }>(EXAMPLE_KEY);
  const restoredExample = storedExample && findExample(storedVersion, storedExample.rule) ? storedExample : undefined;

  const [exampleRule, trueSetExampleRule] = createSignal(restoredExample?.rule ?? '');
  const [exampleVariant, trueSetExampleVariant] = createSignal<ExampleVariant>(restoredExample?.variant ?? 'incorrect');

  const rememberExample = (rule: string, variant: ExampleVariant) => {
    trueSetExampleRule(rule);
    trueSetExampleVariant(variant);
    if (rule) writeJson(EXAMPLE_KEY, { rule, variant });
    else safeRemove(EXAMPLE_KEY);
  };

  const [exampleError, setExampleError] = createSignal('');
  // A fresh array each load, so re-picking the same rule re-reveals the file.
  const [exampleOpenFiles, setExampleOpenFiles] = createSignal<string[]>([]);

  // A shared link carries its files in the hash. Read it once and clear it, so a
  // later reload shows the working copy rather than resetting to the link.
  const openingTabs = (): Tab[] => {
    const hash = location.hash.slice(1) || (typeof location.query.hash === 'string' ? location.query.hash : '');
    if (hash) {
      const fromHash = parseHash<Tab[] | undefined>(hash, undefined);
      if (fromHash?.length) return fromHash;
    }
    const saved = readJson<{ files?: { name: string; content: string }[] }>(SCRATCHPAD_KEY);
    if (saved?.files?.length) return saved.files.map((file) => ({ name: file.name, source: file.content }));
    return defaultTabs;
  };

  const migrateTabs = (version: string | undefined) => {
    const isV2 = isSolidV2(version);
    const current = tabs();
    let changed = false;
    for (const tab of current) {
      if (tab.name === 'import_map.json') continue;
      const migrated = isV2
        ? tab.source.replaceAll('solid-js/web', '@solidjs/web')
        : tab.source.replaceAll('@solidjs/web', 'solid-js/web');
      if (migrated !== tab.source) {
        tab.source = migrated;
        changed = true;
      }
    }
    if (changed) trueSetTabs(current.slice());
  };

  setTabs(openingTabs());
  // The stock scratchpad is written for 1.x, so on a 2.0 session its
  // `solid-js/web` import is a real finding (SC9001) before the reader has typed
  // anything. Bring whatever we open in line with the selected dialect.
  migrateTabs(solidVersion());
  persist();

  createEffect(() => {
    if (location.hash || location.query.hash) navigate('/', { replace: true });
  });

  const reset = () => {
    setTabs(mapTabs(defaultTabs));
    rememberExample('', 'incorrect');
    // Persistence hangs off the per-tab source setter, which this bypasses.
    persist();
  };

  const showExample = (version: string, rule: string, variant: ExampleVariant) =>
    loadExample(version, rule, variant).then(
      (source) => {
        setExampleError('');
        rememberExample(rule, variant);
        // One file, so swapping variants replaces this tab's source in place and
        // the open editor follows it.
        setTabs([{ name: EXAMPLE_FILE, source }]);
        setExampleOpenFiles([EXAMPLE_FILE]);
        persist();
      },
      (error: unknown) => setExampleError(error instanceof Error ? error.message : String(error)),
    );

  const changeSolidVersion = (version: string) => {
    const selected = normalizeSolidVersion(version);
    setSolidVersion(selected);
    localStorage.setItem('solidVersion', selected);
    migrateTabs(selected);

    const rule = exampleRule();
    if (!rule) return;
    // The catalogs overlap by defect, not by rule name. Where the other dialect
    // has the same rule, show its own example rather than analysing this one's
    // code under the wrong dialect; where it does not, only the selection is
    // dropped and the tab is left alone.
    const bare = rule.replace(/^v1\//, '');
    const equivalent = dialectFor(selected) === 'solid-v1' ? `v1/${bare}` : bare;
    if (findExample(selected, equivalent)) void showExample(selected, equivalent, exampleVariant());
    else rememberExample('', 'incorrect');
  };

  const changeExample = (rule: string) => {
    if (!rule) {
      rememberExample('', 'incorrect');
      return;
    }
    // A newly picked rule always opens on the code that reports it.
    void showExample(solidVersion(), rule, 'incorrect');
  };

  const toggleExampleVariant = () => {
    const rule = exampleRule();
    if (rule) void showExample(solidVersion(), rule, OTHER_VARIANT[exampleVariant()]);
  };

  const onUserEdit = () => {
    // The tab no longer holds the example as shipped, so stop claiming it does.
    if (exampleRule()) rememberExample('', 'incorrect');
  };

  return (
    <>
      <Header
        solidVersion={solidVersion()}
        onSolidVersionChange={changeSolidVersion}
        exampleRule={exampleRule()}
        onExampleChange={changeExample}
        exampleVariant={exampleVariant()}
        onExampleVariantToggle={toggleExampleVariant}
      />
      <Show when={exampleError()}>
        {(message) => <p class={exampleErrorStyles}>Could not load that example: {message()}</p>}
      </Show>
      <Repl
        compiler={compiler}
        formatter={formatter}
        linter={linter}
        version={solidVersion()}
        dark={context.dark()}
        tabs={tabs()}
        setTabs={setTabs}
        openFiles={exampleOpenFiles()}
        reset={reset}
        onUserEdit={onUserEdit}
        storage={replStorage}
        id="repl"
      />
    </>
  );
};
