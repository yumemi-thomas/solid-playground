import { Show, createSignal, type Component } from 'solid-js';

const [signedIn, setSignedIn] = createSignal(false);

// The type stays Component, but the condition is now inside tracked JSX
// control flow instead of choosing the returned tree during setup.
const Dashboard: Component = () => (
  <Show when={signedIn()} fallback={<p>Please sign in</p>}>
    <p>Welcome</p>
  </Show>
);

export function App() {
  return (
    <>
      <Dashboard />
      <button onClick={() => setSignedIn(true)}>Sign in</button>
    </>
  );
}
