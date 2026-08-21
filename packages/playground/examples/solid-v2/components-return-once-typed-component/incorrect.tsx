import { createSignal, type Component } from 'solid-js';

const [signedIn, setSignedIn] = createSignal(false);

// The explicit Component annotation is a type fact: this is still a Solid
// component body, even though it is stored in a value rather than exported as
// a function declaration.
const Dashboard: Component = () => {
  if (signedIn()) return <p>Welcome</p>;
  return <p>Please sign in</p>;
};

export function App() {
  return (
    <>
      <Dashboard />
      <button onClick={() => setSignedIn(true)}>Sign in</button>
    </>
  );
}
