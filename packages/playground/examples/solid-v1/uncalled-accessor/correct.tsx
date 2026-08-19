import { createSignal } from 'solid-js';

// Calling the accessor at each value-consuming use is what reads the signal —
// and, inside JSX, what subscribes to it.
export function Counter() {
  const [count] = createSignal(0);
  return (
    <div>
      <span>{`count is ${count()}`}</span>
      <span>{-count()}</span>
    </div>
  );
}
