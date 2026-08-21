import { Show, createSignal } from 'solid-js';

const [user, setUser] = createSignal<string | null>(null);

// One JSX tree keeps the condition inside a tracked control-flow boundary.
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
