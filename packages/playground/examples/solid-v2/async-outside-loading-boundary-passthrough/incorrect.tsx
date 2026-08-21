import { createMemo, createSignal, type Element } from 'solid-js';

interface User {
  name: string;
}

const [id] = createSignal('ada');

declare function fetchUser(userId: string): Promise<User>;

const user = createMemo(() => fetchUser(id()));

// A component boundary is not automatically an async boundary. This typed
// wrapper forwards children unchanged, so the pending read still has nowhere
// to render a fallback.
function AsyncShell(props: { children: Element }) {
  return <section class="shell">{props.children}</section>;
}

export function Profile() {
  return (
    <AsyncShell>
      <h1>{user().name}</h1>
    </AsyncShell>
  );
}
