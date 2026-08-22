import { Loading, createMemo, createSignal } from 'solid-js';

interface User {
  name: string;
}

const [id] = createSignal('ada');

async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`/users/${userId}`);
  return response.json() as Promise<User>;
}

// Removing the false sync promise lets the value suspend normally.
const user = createMemo(() => fetchUser(id()));

export function Profile() {
  return (
    <Loading fallback={<p>Loading…</p>}>
      <h1>{user().name}</h1>
    </Loading>
  );
}
