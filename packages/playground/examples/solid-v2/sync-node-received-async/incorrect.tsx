import { createMemo, createSignal } from 'solid-js';

interface User {
  name: string;
}

const [id] = createSignal('ada');

async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`/users/${userId}`);
  return response.json() as Promise<User>;
}

// `sync: true` promises this node always has a value the instant it is read. An
// async compute cannot keep that promise: there is a window with nothing to
// return and no way to wait.
const user = createMemo(async () => fetchUser(id()), { sync: true, loadingValue: { name: 'anonymous' } });

export function Profile() {
  return <h1>{user().name}</h1>;
}
