import { createMemo, createSignal, onSettled } from 'solid-js';

// A memo attaches itself to the owner chain, and a leaf owner has no room for
// children — so creating one inside `onSettled` throws in dev.
export function Widget() {
  const [count] = createSignal(0);

  onSettled(() => {
    const label = createMemo(() => `count is ${count()}`);
    console.log(label());
  });

  return <div>{count()}</div>;
}
