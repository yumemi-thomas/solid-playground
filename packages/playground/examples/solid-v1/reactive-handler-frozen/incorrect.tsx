import { createSignal } from 'solid-js';

function save() {
  console.log('saved');
}

function audit() {
  console.log('audited');
}

// The caller passes a signal-backed handler. Solid installs the prop read once
// while setting up the listener, so later handler changes cannot replace it.
function SaveButton(props: { onSave: () => void }) {
  return <button onClick={props.onSave}>Save</button>;
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
