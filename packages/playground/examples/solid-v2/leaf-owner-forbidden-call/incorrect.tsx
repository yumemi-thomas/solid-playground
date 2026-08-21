import { createMemo, onCleanup, onSettled, flush } from 'solid-js';

declare function tick(): void;

// onSettled is a leaf owner: it cannot attach children, register onCleanup, or
// re-enter the flush cycle. This deliberately puts all three forbidden forms
// in one callback so the example covers the merged SC3001 rule.
export function Widget() {
  onSettled(() => {
    const label = createMemo(() => 'ticking');
    onCleanup(() => tick());
    flush();
    console.log(label());
  });
  return <div>ticking</div>;
}
