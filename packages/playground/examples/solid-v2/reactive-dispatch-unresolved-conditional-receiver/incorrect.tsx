import { createSignal } from 'solid-js';

const [count] = createSignal(0);
type Reader = { read: () => number };
const reactive: Reader = { read: () => count() };
const quiet: Reader = { read: () => 0 };

function invoke(reader: Reader) {
  return reader.read();
}

export function Ticker() {
  const reader = Math.random() > 0.5 ? reactive : quiet;
  const value = invoke(reader);
  return <span>{value}</span>;
}
