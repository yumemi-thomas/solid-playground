import { createSignal } from 'solid-js';

const [title, setTitle] = createSignal('Draft');

// The props object stays intact and each member is read where it is used.
function Card(props: { label: string }) {
  return <h2>{props.label}</h2>;
}

export function App() {
  return (
    <>
      <Card label={title()} />
      <button onClick={() => setTitle('Published')}>Publish</button>
    </>
  );
}
