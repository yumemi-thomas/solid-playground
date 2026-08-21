import { EXAMPLES_BY_DIALECT, type ExampleEntry } from './catalog';
import { composeExample, type ExampleVariant } from './composeExample';
import type { Dialect } from './types';

export { EXAMPLES_BY_DIALECT, type ExampleEntry } from './catalog';
export { OTHER_VARIANT, VARIANT_ACTION, composeExample, type ExampleVariant } from './composeExample';
export type { Dialect } from './types';

/**
 * Every example file, keyed by its path and loaded on demand. Keeping them as
 * real `.tsx` files under `packages/playground/examples/` is what lets
 * `scripts/verify-examples.mjs` run the checker over the exact bytes the
 * playground loads.
 */
const sources = import.meta.glob('../../examples/*/*/*.tsx', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

/** The primary file an example puts in the repl. Named so the preview pane resolves. */
export const EXAMPLE_FILE = 'main.tsx';

/** The dialect a Solid package selection analyses under. */
export function dialectFor(version: string | undefined): Dialect {
  return version?.startsWith('2.') ? 'solid-v2' : 'solid-v1';
}

export function examplesFor(version: string | undefined): readonly ExampleEntry[] {
  return EXAMPLES_BY_DIALECT[dialectFor(version)];
}

export function findExample(version: string | undefined, rule: string): ExampleEntry | undefined {
  return examplesFor(version).find((entry) => entry.rule === rule);
}

/** Groups an example list into the picker's `optgroup` order, keeping catalog order inside each. */
export function groupExamples(entries: readonly ExampleEntry[]): Array<[string, ExampleEntry[]]> {
  const groups = new Map<string, ExampleEntry[]>();
  const seenRules = new Set<string>();
  for (const entry of entries) {
    if (seenRules.has(entry.rule)) continue;
    seenRules.add(entry.rule);
    const group = groups.get(entry.category);
    if (group) group.push(entry);
    else groups.set(entry.category, [entry]);
  }
  return [...groups];
}

/**
 * Loads the first case file for callers that only need one example. The
 * playground uses loadExamples() so all cases for a rule open together.
 */
export async function loadExample(version: string | undefined, rule: string, variant: ExampleVariant): Promise<string> {
  return (await loadExamples(version, rule, variant))[0].source;
}

export interface LoadedExample {
  name: string;
  source: string;
}

/** Loads every case file belonging to one rule, preserving catalog order. */
export async function loadExamples(
  version: string | undefined,
  rule: string,
  variant: ExampleVariant,
): Promise<LoadedExample[]> {
  const dialect = dialectFor(version);
  const entries = examplesFor(version).filter((entry) => entry.rule === rule);
  if (!entries.length) throw new Error(`No ${dialect} example for ${rule}.`);

  return Promise.all(
    entries.map(async (entry, index) => {
      const path = `../../examples/${dialect}/${entry.dir}/${variant}.tsx`;
      const load = sources[path];
      if (!load) throw new Error(`Missing example file ${path}.`);

      return {
        name: entry.file ?? (index === 0 ? EXAMPLE_FILE : `case-${index + 1}.tsx`),
        source: composeExample(entry, variant, await load()),
      };
    }),
  );
}
