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

// A `<Loading>` boundary owns the wait and renders visible fallback UI until the
// subtree below it can commit.
export function Profile() {
  return (
    <Loading fallback={<span>Loading…</span>}>
      <h1>{user().name}</h1>
    </Loading>
  );
}
