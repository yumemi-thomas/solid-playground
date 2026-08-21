import { createStore } from 'solid-js';

function noop() {}

function Button(props: { onClick: () => void }) {
  // DOM setup reads this prop once and installs that function forever.
  return <button onClick={props.onClick}>Save</button>;
}

const [handlers] = createStore({ click: noop });

export function App() {
  return <Button onClick={handlers.click} />;
}
