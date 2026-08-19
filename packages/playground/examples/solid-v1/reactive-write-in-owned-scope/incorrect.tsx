import { createSignal } from 'solid-js';

// A write in a component body feeds the very graph that is still being built:
// the value that was just rendered is replaced before the first paint, and any
// computation reading it re-runs mid-setup.
export function Counter() {
  const [count, setCount] = createSignal(0);

  setCount(1);

  return <span>{count()}</span>;
}
