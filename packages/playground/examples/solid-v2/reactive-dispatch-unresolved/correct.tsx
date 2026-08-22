import { createSignal } from 'solid-js';

const [count] = createSignal(0);
const readCount = () => count();

export function Ticker() {
  // Narrow the runtime target to one exact implementation.
  return <span>{readCount()}</span>;
}
