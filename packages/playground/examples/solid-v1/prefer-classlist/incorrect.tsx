import { createSignal } from 'solid-js';

declare function clsx(...inputs: unknown[]): string;

// A classnames-style helper rebuilds the whole class string on every update.
// Solid can toggle individual classes in place instead.
export function Row() {
  const [selected] = createSignal(false);
  return <div class={clsx({ selected: selected() })}>row</div>;
}
