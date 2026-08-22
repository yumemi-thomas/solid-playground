import { createSignal } from 'solid-js';

// `count` is the accessor function, not the number it holds. Interpolating it
// stringifies the function's own source and never reads the signal.
export function Counter() {
  const [count] = createSignal(0);
  return <span>{`count is ${count}`}</span>;
}
