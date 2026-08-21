import { Loading, createMemo, createSignal } from 'solid-js';

interface User {
  id: string;
  name: string;
}

const [id] = createSignal('ada');

async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`/users/${userId}`);
  return response.json() as Promise<User>;
}

const user = createMemo(() => fetchUser(id()));

export function App() {
  return <Loading fallback={<span>Loading…</span>}><h1>{user().name}</h1></Loading>;
}
