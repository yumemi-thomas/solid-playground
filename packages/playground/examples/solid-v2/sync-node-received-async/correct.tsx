import { createMemo, createSignal } from 'solid-js';

interface User {
  name: string;
}

const [id] = createSignal('ada');

async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`/users/${userId}`);
  return response.json() as Promise<User>;
}

// The async work lives in its own node, which declares a first paint so readers
// always have a value. The synchronous node then reads that settled value, which
// is a promise `sync: true` can keep.
const user = createMemo(() => fetchUser(id()), { loadingValue: { name: 'anonymous' } });
const initials = createMemo(() => user().name.slice(0, 1), { sync: true });

export function Profile() {
  return <h1>{initials()}</h1>;
}
