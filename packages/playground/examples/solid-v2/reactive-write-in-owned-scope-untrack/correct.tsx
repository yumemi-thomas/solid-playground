import { createSignal, untrack } from 'solid-js';

export function Counter() {
  const [count, setCount] = createSignal(0);

  // The event handler has no owner, so this imperative write is legal.
  return <button onClick={() => untrack(() => setCount(1))}>{count()}</button>;
}
