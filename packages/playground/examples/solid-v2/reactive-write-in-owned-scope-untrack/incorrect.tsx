import { createSignal, untrack } from 'solid-js';

export function Counter() {
  const [count, setCount] = createSignal(0);

  // untrack clears the observer, not the component owner used by the guard.
  untrack(() => setCount(1));

  return <span>{count()}</span>;
}
