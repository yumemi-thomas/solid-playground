import { For, Show, createMemo, type Component } from 'solid-js';
import { Icon } from 'solid-heroicons';
import { arrowUturnLeft, check } from 'solid-heroicons/outline';
import { Button } from 'solid-repl/src/components/ui/Button';
import { css, cx } from 'styled-system/css';
import { VARIANT_ACTION, examplesFor, groupExamples, type ExampleEntry, type ExampleVariant } from '../examples';

const selectStyles = css({
  maxWidth: 64,
  px: 2,
  py: 1.5,
  rounded: 'md',
  borderWidth: '1px',
  borderColor: 'neutral.300',
  bg: 'white',
  color: 'black',
  fontSize: 'sm',
  cursor: 'pointer',
  _hover: { borderColor: 'solidc' },
  _focus: { borderColor: 'solidc', outline: 'none' },
  _dark: { borderColor: 'neutral.700', bg: 'neutral.900', color: 'white' },
});

const selectOnMobile = css({ maxWidth: 'full', mx: 2, my: 1 });

const headerButtonOnMobile = css({
  rounded: 'none',
  _active: { bg: 'gray.300' },
  _hover: { bg: 'gray.300', _dark: { color: 'black' } },
});

const optionLabel = (entry: ExampleEntry) =>
  `${entry.code} · ${entry.rule}${entry.standalone === false ? ' (documented only)' : ''}`;

export const ExampleSelect: Component<{
  /** The Solid package currently selected; decides which catalog is offered. */
  version: string | undefined;
  /** The rule whose example is loaded, or '' when the repl holds something else. */
  rule: string;
  onChange: (rule: string) => void;
  showOnMobile: boolean;
}> = (props) => {
  const groups = createMemo(() => groupExamples(examplesFor(props.version)));
  const count = createMemo(() => examplesFor(props.version).length);

  return (
    <label class={css({ display: 'contents' })}>
      <span class={css({ srOnly: true })}>Load a solid-checker rule example</span>
      <select
        class={cx(selectStyles, props.showOnMobile && selectOnMobile)}
        title={`Load one of the ${count()} rule examples for this Solid version`}
        value={props.rule}
        onChange={(event) => props.onChange(event.currentTarget.value)}
      >
        <option value="">Rule examples…</option>
        <For each={groups()}>
          {([category, entries]) => (
            <optgroup label={category}>
              <For each={entries}>{(entry) => <option value={entry.rule}>{optionLabel(entry)}</option>}</For>
            </optgroup>
          )}
        </For>
      </select>
      <Show when={props.rule}>{(rule) => <span class={css({ srOnly: true })}>Loaded example: {rule()}</span>}</Show>
    </label>
  );
};

/** Swaps the loaded example between the code that reports the rule and the fix. */
export const ExampleVariantButton: Component<{
  variant: ExampleVariant;
  onToggle: () => void;
  showOnMobile: boolean;
}> = (props) => (
  <Button
    onClick={props.onToggle}
    class={cx(props.showOnMobile && headerButtonOnMobile)}
    title={
      props.variant === 'incorrect'
        ? 'Replace this example with the version the rule does not report'
        : 'Go back to the version the rule reports'
    }
  >
    <Icon path={props.variant === 'incorrect' ? check : arrowUturnLeft} class={css({ h: 6 })} />
    <span class={css({ fontSize: 'sm' })}>{VARIANT_ACTION[props.variant]}</span>
  </Button>
);
