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

// A component body tracks nothing, so this read cannot suspend and cannot be
// retried. While the fetch is still in flight the runtime throws
// PENDING_ASYNC_UNTRACKED_READ.
function Profile() {
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
