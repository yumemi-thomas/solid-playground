import { createMemo, createSignal } from 'solid-js';

const [count, setCount] = createSignal(0);
const doubled = createMemo(() => count() * 2);

export function App() {
  return <button onClick={() => setCount(count() + 1)}>{doubled()}</button>;
}
