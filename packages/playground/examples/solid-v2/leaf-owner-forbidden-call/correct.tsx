import { createMemo, onSettled } from 'solid-js';

// Create child work in the component owner, then read it from the leaf.
export function Widget() {
  const label = createMemo(() => 'ticking');
  onSettled(() => {
    console.log(label());
  });
  return <div>{label()}</div>;
}
