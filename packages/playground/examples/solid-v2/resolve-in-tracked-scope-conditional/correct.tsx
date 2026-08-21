import { createMemo, createSignal } from 'solid-js';

const [user] = createSignal('ada');

export function Label() {
  const label = createMemo(() => user());
  return <div>{label()}</div>;
}
