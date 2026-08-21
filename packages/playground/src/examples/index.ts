import { EXAMPLES_BY_DIALECT, exampleKey, type ExampleEntry } from './catalog';
import { composeExample, type ExampleVariant } from './composeExample';
import type { Dialect } from './types';

export { EXAMPLES_BY_DIALECT, exampleKey, type ExampleEntry } from './catalog';
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

/** The one file an example puts in the repl. Named so the preview pane resolves. */
export const EXAMPLE_FILE = 'main.tsx';

/** The dialect a Solid package selection analyses under. */
export function dialectFor(version: string | undefined): Dialect {
  return version?.startsWith('2.') ? 'solid-v2' : 'solid-v1';
}

export function examplesFor(version: string | undefined): readonly ExampleEntry[] {
  return EXAMPLES_BY_DIALECT[dialectFor(version)];
}

export function findExample(version: string | undefined, rule: string): ExampleEntry | undefined {
  return examplesFor(version).find((entry) => exampleKey(entry) === rule);
}

/** Groups an example list into the picker's `optgroup` order, keeping catalog order inside each. */
export function groupExamples(entries: readonly ExampleEntry[]): Array<[string, ExampleEntry[]]> {
  const groups = new Map<string, ExampleEntry[]>();
  for (const entry of entries) {
    const group = groups.get(entry.category);
    if (group) group.push(entry);
    else groups.set(entry.category, [entry]);
  }
  return [...groups];
}

/**
 * Loads one variant of one example as the single file to drop into the repl. The
 * header names the rule and points at the button that swaps to the other
 * variant, so the file is self-describing on its own.
 */
export async function loadExample(version: string | undefined, rule: string, variant: ExampleVariant): Promise<string> {
  const dialect = dialectFor(version);
  const entry = findExample(version, rule);
  if (!entry) throw new Error(`No ${dialect} example for ${rule}.`);

  const path = `../../examples/${dialect}/${entry.dir}/${variant}.tsx`;
  const load = sources[path];
  if (!load) throw new Error(`Missing example file ${path}.`);

  return composeExample(entry, variant, await load());
}
