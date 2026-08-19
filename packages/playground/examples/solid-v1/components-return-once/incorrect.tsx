import { createSignal } from 'solid-js';

const [user, setUser] = createSignal<string | null>(null);

// Two return statements: the test runs once, while the component is being set
// up, so the branch it picks is the branch that renders forever. Signing in
// afterwards changes the signal and nothing on screen.
export function Dashboard() {
  if (user() === null) {
    return <p>Please sign in.</p>;
  }
  return <p>Welcome back, {user()}.</p>;
}

export function SignInButton() {
  return <button onClick={() => setUser('Ada')}>Sign in</button>;
}
