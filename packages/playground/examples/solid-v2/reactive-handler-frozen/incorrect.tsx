import { createStore } from 'solid-js';

function noop() {}

// A store-backed handler prop is read during listener setup. Later store
// updates cannot replace the installed function.
function SaveButton(props: { onSave: () => void }) {
  return <button onClick={props.onSave}>Save</button>;
}

export function App() {
  const [handlers] = createStore({ save: noop });
  return <SaveButton onSave={handlers.save} />;
}
