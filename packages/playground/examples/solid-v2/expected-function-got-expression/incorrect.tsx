import { createSignal, createStore } from 'solid-js';

function noop() {}

// `onClick` binds whatever the expression evaluates to at the moment the
// listener is installed. Reading a reactive prop there consumes it once, so a
// later handler never replaces the bound one.
function SaveButton(props: { onSave: () => void }) {
  return <button onClick={props.onSave}>Save</button>;
}

export function App() {
  const [handlers] = createStore({ save: noop });
  const [label] = createSignal('Save');
  return (
    <div>
      <SaveButton onSave={handlers.save} />
      <span>{label()}</span>
    </div>
  );
}
