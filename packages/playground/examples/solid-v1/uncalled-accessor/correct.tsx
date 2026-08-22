import { createSignal } from 'solid-js';

// Calling the accessor reads the signal and, inside JSX, subscribes to it.
export function Counter() {
  const [count] = createSignal(0);
  return <span>{`count is ${count()}`}</span>;
}
