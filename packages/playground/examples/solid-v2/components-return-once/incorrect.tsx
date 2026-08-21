import { createSignal } from 'solid-js';

const [user, setUser] = createSignal<string | null>(null);

// The condition is evaluated once while the component is set up, so signing
// in later cannot change which tree was returned.
export function Dashboard() {
  if (user() === null) return <p>Please sign in.</p>;
  return <p>Welcome back, {user()}.</p>;
}

export function SignInButton() {
  return <button onClick={() => setUser('Ada')}>Sign in</button>;
}
