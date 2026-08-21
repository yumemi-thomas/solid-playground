import { createMemo, createSignal, resolve } from 'solid-js';

const [user] = createSignal('ada');

export function Label() {
  const label = createMemo(() => {
    // Putting the call behind a branch does not make an imperative read safe.
    if (user() === 'ada') resolve(() => 'ready');
    return user();
  });
  return <div>{label()}</div>;
}
