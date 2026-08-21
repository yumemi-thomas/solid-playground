import { createSignal } from 'solid-js';

const [count] = createSignal(0);

export function Ticker() {
  const reactive = { read: () => count() };
  const quiet = { read: () => 0 };
  const invoke = (reader: { read(): number }) => reader.read();
  const value = invoke(Math.random() > 0.5 ? reactive : quiet);
  return <span>{value}</span>;
}
