import { createMemo, createSignal } from 'solid-js';

const [id] = createSignal('ada');

// The inferred Promise result is allowed to be async. loadingValue makes the
// first paint explicit while the real answer is pending.
const user = createMemo(() => Promise.resolve({ name: id() }), {
  loadingValue: { name: 'anonymous' },
});

export function Profile() {
  return <h1>{user().name}</h1>;
}
