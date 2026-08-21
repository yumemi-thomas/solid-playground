import { createMemo, createSignal } from 'solid-js';

interface User {
  name: string;
}

const [id] = createSignal('ada');

declare function fetchUser(userId: string): Promise<User>;

// There is no `async` keyword here, but Promise.resolve still gives the
// computation an async result. `sync: true` is therefore a false contract.
const user = createMemo(() => Promise.resolve(fetchUser(id())), {
  sync: true,
  loadingValue: { name: 'anonymous' },
});

export function Profile() {
  return <h1>{user().name}</h1>;
}
