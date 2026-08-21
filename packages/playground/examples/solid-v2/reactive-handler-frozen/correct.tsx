import { createStore } from 'solid-js';

function noop() {}

// The wrapper stays installed, while the prop is read when the click runs.
function SaveButton(props: { onSave: () => void }) {
  return <button onClick={() => props.onSave()}>Save</button>;
}

export function App() {
  const [handlers] = createStore({ save: noop });
  return <SaveButton onSave={handlers.save} />;
}
