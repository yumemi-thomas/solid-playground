import { createSignal } from 'solid-js';

const [name, setName] = createSignal('Ada');

function Profile(props: { name: string }) {
  // The property access happens inside JSX, which is a tracking scope, so the
  // heading re-renders whenever the prop's source changes.
  return <h1>{props.name}</h1>;
}

export function App() {
  return (
    <>
      <Profile name={name()} />
      <button onClick={() => setName('Grace')}>Rename</button>
    </>
  );
}
