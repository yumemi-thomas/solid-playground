import { createMemo, createSignal } from 'solid-js';

interface User {
  name: string;
}

const [id] = createSignal('ada');

async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`/users/${userId}`);
  return response.json() as Promise<User>;
}

// sync: true promises an immediately available value, but this computation
// has a pending promise and no synchronous answer.
const user = createMemo(async () => fetchUser(id()), { sync: true, loadingValue: { name: 'anonymous' } });

export function Profile() {
  return <h1>{user().name}</h1>;
}
