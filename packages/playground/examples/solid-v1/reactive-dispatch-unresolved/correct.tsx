import { createSignal } from 'solid-js';

const [count] = createSignal(0);

export function Ticker() {
  // Remove the dynamic dispatch and read the exact reactive source in JSX.
  return <span>{count()}</span>;
}
