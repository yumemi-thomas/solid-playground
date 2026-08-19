import { createMemo, createSignal, resolve } from 'solid-js';

const [user] = createSignal('ada');

// `resolve()` settles a value imperatively, and the runtime refuses to do that
// while an observer is active. Inside a memo's compute an observer always is,
// so this throws in dev.
export function Label() {
  const label = createMemo(() => {
    void resolve(() => user());
    return user();
  });
  return <div>{label()}</div>;
}
