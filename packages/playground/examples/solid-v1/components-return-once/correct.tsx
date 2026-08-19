import { Show, createSignal } from 'solid-js';

const [user, setUser] = createSignal<string | null>(null);

// One JSX tree, with the condition inside it. `<Show>` re-evaluates `when` as a
// tracked read, so the branch really does change when the signal does.
export function Dashboard() {
  return (
    <Show when={user()} fallback={<p>Please sign in.</p>}>
      <p>Welcome back, {user()}.</p>
    </Show>
  );
}

export function SignInButton() {
  return <button onClick={() => setUser('Ada')}>Sign in</button>;
}
