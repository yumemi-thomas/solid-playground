import { createSignal } from 'solid-js';

function noop() {}

// The bound value is a function written in place. It calls through to the prop
// when the click happens, so whichever handler is current then is the one run.
function SaveButton(props: { onSave: () => void }) {
  return <button onClick={() => props.onSave()}>Save</button>;
}

export function App() {
  const [handler] = createSignal(noop);
  return <SaveButton onSave={handler()} />;
}
