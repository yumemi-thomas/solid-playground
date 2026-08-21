import { createMemo, createSignal } from 'solid-js';

interface User {
  name: string;
}

const [id] = createSignal('ada');

declare function fetchUser(userId: string): Promise<User>;

// The inferred Promise result is allowed to be async. loadingValue makes the
// first paint explicit while the real answer is pending.
const user = createMemo(() => Promise.resolve(fetchUser(id())), {
  loadingValue: { name: 'anonymous' },
});

export function Profile() {
  return <h1>{user().name}</h1>;
}
