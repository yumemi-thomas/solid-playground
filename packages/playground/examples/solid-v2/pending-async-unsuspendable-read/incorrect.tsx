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

// The component body is untracked, so this read cannot suspend and retry when
// the async value settles. The surrounding Loading boundary cannot repair it.
export function Profile() {
  const name = user().name;
  return <h1>{name}</h1>;
}

export function App() {
  return (
    <Loading fallback={<span>Loading…</span>}>
      <Profile />
    </Loading>
  );
}
