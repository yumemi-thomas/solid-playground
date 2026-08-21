import { createMemo, onSettled } from 'solid-js';

declare function tick(): void;

// Create child work in the component owner, return cleanup from the leaf, and
// do not re-enter a flush that is already settling.
export function Widget() {
  const label = createMemo(() => 'ticking');
  onSettled(() => {
    console.log(label());
    return tick;
  });
  return <div>{label()}</div>;
}
