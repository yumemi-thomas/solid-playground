import { createMemo, createSignal, onSettled } from 'solid-js';

// Create the memo in the component body, which can own it, and read its
// accessor from the leaf owner.
export function Widget() {
  const [count] = createSignal(0);
  const label = createMemo(() => `count is ${count()}`);

  onSettled(() => {
    console.log(label());
  });

  return <div>{count()}</div>;
}
