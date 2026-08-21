import { createMemo, createSignal } from 'solid-js';

interface User {
  name: string;
}

const [id] = createSignal('ada');

async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`/users/${userId}`);
  return response.json() as Promise<User>;
}

// The async node declares its first paint. The synchronous node only reads the
// already-readable value and can therefore keep sync: true.
const user = createMemo(() => fetchUser(id()), { loadingValue: { name: 'anonymous' } });
const initials = createMemo(() => user().name.slice(0, 1), { sync: true });

export function Profile() {
  return <h1>{initials()}</h1>;
}
