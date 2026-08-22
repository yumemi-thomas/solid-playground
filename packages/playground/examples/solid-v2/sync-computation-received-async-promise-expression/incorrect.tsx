import { createMemo, createSignal } from 'solid-js';

const [id] = createSignal('ada');

// There is no `async` keyword here, but Promise.resolve still gives the
// computation an async result. `sync: true` is therefore a false contract.
const user = createMemo(() => Promise.resolve({ name: id() }), {
  sync: true,
  loadingValue: { name: 'anonymous' },
});

export function Profile() {
  return <h1>{user().name}</h1>;
}
