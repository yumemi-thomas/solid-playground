import { createSignal } from 'solid-js';

const [title, setTitle] = createSignal('Draft');

// Keep the props object intact and read its member where JSX tracks it.
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
