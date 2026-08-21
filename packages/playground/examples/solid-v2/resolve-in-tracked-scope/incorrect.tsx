import { createMemo, createSignal, resolve } from 'solid-js';

const [user] = createSignal('ada');

// resolve() is imperative and cannot run while a memo observer is active.
export function Label() {
  const label = createMemo(() => {
    void resolve(() => user());
    return user();
  });
  return <div>{label()}</div>;
}
