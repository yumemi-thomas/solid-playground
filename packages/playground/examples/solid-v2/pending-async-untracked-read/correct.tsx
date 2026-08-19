import { Loading, createMemo, createSignal } from 'solid-js';

interface User {
  name: string;
}

const [id] = createSignal('ada');

async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`/users/${userId}`);
  return response.json() as Promise<User>;
}

const user = createMemo(() => fetchUser(id()));

// Reads inside JSX are tracked: a pending read suspends to the nearest
// `<Loading>` boundary and re-runs once the value settles.
function Profile() {
  return <h1>{user().name}</h1>;
}

export function App() {
  return (
    <Loading fallback={<span>Loading…</span>}>
      <Profile />
    </Loading>
  );
}
