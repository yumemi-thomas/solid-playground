import { createMemo, createSignal } from 'solid-js';

export function Counter() {
  const [count] = createSignal(1);
  const [doubled, setDoubled] = createSignal(0);

  createMemo(() => setDoubled(count() * 2));

  return <span>{doubled()}</span>;
}
