import { createSignal } from 'solid-js';

const [count] = createSignal(0);
type Reader = { read: () => number };
const reactive: Reader = { read: () => count() };

export function Ticker() {
  // Narrow the runtime receiver to one exact implementation.
  return <span>{reactive.read()}</span>;
}
