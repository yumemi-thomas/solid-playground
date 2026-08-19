import { createMemo, createSignal } from 'solid-js';

interface User {
  name: string;
}

const [id] = createSignal('ada');

async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`/users/${userId}`);
  return response.json() as Promise<User>;
}

const user = createMemo(() => fetchUser(id()));

// The read is tracked, so it suspends correctly — but there is no boundary above
// it to show anything while it waits, so the whole subtree mounts only once the
// fetch has settled.
export function Profile() {
  return <h1>{user().name}</h1>;
}
