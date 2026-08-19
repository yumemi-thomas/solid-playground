import { createSignal } from 'solid-js';

function noop() {}

// `onClick` binds whatever the expression evaluates to at the moment the
// listener is installed. Reading a reactive prop there consumes it once, so a
// later handler never replaces the bound one.
//
// The 1.x catalog reports the untracked read as well: the handler rule owns the
// listener-setup defect, and `strict-read-untracked` owns the stale read.
function SaveButton(props: { onSave: () => void }) {
  return <button onClick={props.onSave}>Save</button>;
}

export function App() {
  const [handler] = createSignal(noop);
  return <SaveButton onSave={handler()} />;
}
