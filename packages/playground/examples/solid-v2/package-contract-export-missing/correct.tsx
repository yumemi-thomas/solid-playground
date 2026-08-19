import { Loading, createMemo, createSignal } from 'solid-js';

const [id] = createSignal('ada');

declare function fetchUser(userId: string): Promise<{ name: string }>;

// Solid 2.0's replacement is an ordinary computation that returns a promise. It
// is described by the bundled contract, so the analysis can follow it.
const user = createMemo(() => fetchUser(id()));

export function Profile() {
  return (
    <Loading fallback={<span>Loading…</span>}>
      <h1>{user().name}</h1>
    </Loading>
  );
}
