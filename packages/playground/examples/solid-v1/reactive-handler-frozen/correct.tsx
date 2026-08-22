import { createSignal } from 'solid-js';

function save() {
  console.log('saved');
}

function audit() {
  console.log('audited');
}

// The wrapper is stable, while the prop is read when the click actually runs.
function SaveButton(props: { onSave: () => void }) {
  return <button onClick={() => props.onSave()}>Save</button>;
}

export function App() {
  const [handler, setHandler] = createSignal(save);
  return (
    <>
      <SaveButton onSave={handler()} />
      <button onClick={() => setHandler(() => audit)}>Replace handler</button>
    </>
  );
}
