import { createSignal, createTrackedEffect } from 'solid-js';

const [count, setCount] = createSignal(0);

// The callback the owner receives is written in place, so its body is exactly
// what the checker inspects and the leaf scope's obligations are decidable.
export function Ticker() {
  createTrackedEffect(() => {
    setCount((previous) => previous + 1);
  });
  return <span>{count()}</span>;
}
