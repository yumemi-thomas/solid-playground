import { Loading, createMemo, createSignal } from 'solid-js';

const [id] = createSignal('ada');

declare function fetchUser(userId: string): Promise<{ name: string }>;

// The Solid 2 computation is a bundled, described export and can be certified.
const user = createMemo(() => fetchUser(id()));

export function Profile() {
  return <Loading fallback={<span>Loading…</span>}><h1>{user().name}</h1></Loading>;
}
