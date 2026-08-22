import { createSignal } from 'solid-js';

const [count] = createSignal(0);
const readers = [() => count(), () => 0] as const;

export function Ticker() {
  const index = Math.random() > 0.5 ? 0 : 1;
  // The selected function may read count or may be inert. Because this call is
  // outside JSX, the checker must know which behavior actually runs.
  const value = readers[index]();
  return <span>{value}</span>;
}
