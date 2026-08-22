import { createMemo, createSignal } from 'solid-js';

// This value is a derivation, so model it directly instead of writing from one
// reactive computation into another signal.
export function Counter() {
  const [count, setCount] = createSignal(0);
  const doubled = createMemo(() => count() * 2);

  return <button onClick={() => setCount((previous) => previous + 1)}>{doubled()}</button>;
}
