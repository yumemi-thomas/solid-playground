import { createMemo, createSignal } from 'solid-js';

const [count, setCount] = createSignal(0);

// The memo reads count and then writes count, creating a feedback edge in its
// own children-capable owner.
const doubled = createMemo(() => {
  setCount(count() + 1);
  return count() * 2;
});

export function App() {
  return <output>{doubled()}</output>;
}
