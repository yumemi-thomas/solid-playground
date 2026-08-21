import { Loading, createMemo, createSignal, type Element } from 'solid-js';

interface User {
  name: string;
}

const [id] = createSignal('ada');

declare function fetchUser(userId: string): Promise<User>;

const user = createMemo(() => fetchUser(id()));

// The wrapper is now a real async boundary. The checker follows the typed
// component call to see that the child is rendered inside Loading.
function AsyncShell(props: { children: Element }) {
  return <Loading fallback={<span>Loading…</span>}>{props.children}</Loading>;
}

export function Profile() {
  return (
    <AsyncShell>
      <h1>{user().name}</h1>
    </AsyncShell>
  );
}
