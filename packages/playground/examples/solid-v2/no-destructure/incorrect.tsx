import { createSignal } from 'solid-js';

const [title, setTitle] = createSignal('Draft');

// Parameter destructuring runs once, so label is a plain value copied out of
// the reactive props object and never updates.
function Card({ label }: { label: string }) {
  return <h2>{label}</h2>;
}

export function App() {
  return (
    <>
      <Card label={title()} />
      <button onClick={() => setTitle('Published')}>Publish</button>
    </>
  );
}
