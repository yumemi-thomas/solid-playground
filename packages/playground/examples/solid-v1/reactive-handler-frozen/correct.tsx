import { createSignal } from 'solid-js';

function noop() {}

// The wrapper is stable, while the prop is read when the click actually runs.
function SaveButton(props: { onSave: () => void }) {
  return <button onClick={() => props.onSave()}>Save</button>;
}

export function App() {
  const [handler] = createSignal(noop);
  return <SaveButton onSave={handler()} />;
}
