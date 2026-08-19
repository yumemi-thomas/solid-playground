import { createSignal } from 'solid-js';

const [name, setName] = createSignal('Ada');

function Profile(props: { name: string }) {
  // Setup-time read: `label` holds the value this component was first given and
  // nothing re-runs this line, so renaming never reaches the heading.
  const label = props.name;
  return <h1>{label}</h1>;
}

export function App() {
  return (
    <>
      <Profile name={name()} />
      <button onClick={() => setName('Grace')}>Rename</button>
    </>
  );
}
