import { Loading, createMemo, createSignal } from 'solid-js';

interface User {
  name: string;
}

const [id] = createSignal('ada');

declare function fetchUser(userId: string): Promise<User>;

const user = createMemo(() => fetchUser(id()));

// This import is the framework boundary. A same-named local component would
// not catch the pending read below.
export function Profile() {
  return (
    <Loading fallback={<span>Loading…</span>}>
      <h1>{user().name}</h1>
    </Loading>
  );
}
