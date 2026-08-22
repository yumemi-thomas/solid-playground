import { createSignal } from 'solid-js';

// A component body runs under a children-capable owner, and Solid 2.0 forbids
// writes there: the write feeds the very graph that is still being built, so
// the runtime throws REACTIVE_WRITE_IN_OWNED_SCOPE in dev.
export function Counter() {
  const [count, setCount] = createSignal(0);

  setCount(1);

  return <span>{count()}</span>;
}
