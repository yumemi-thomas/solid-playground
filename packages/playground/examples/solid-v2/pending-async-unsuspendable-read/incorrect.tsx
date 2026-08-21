import { Loading, createMemo, createSignal, onSettled } from 'solid-js';

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

// The component-body read is untracked and the onSettled read is a leaf. Neither
// scope can suspend and retry while the async value is pending.
export function Profile() {
  const name = user().name;
  onSettled(() => console.log(user().id));
  return <h1>{name}</h1>;
}

export function App() {
  return <Loading fallback={<span>Loading…</span>}><Profile /></Loading>;
}
