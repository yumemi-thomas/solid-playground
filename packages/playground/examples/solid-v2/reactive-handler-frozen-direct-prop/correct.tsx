import { createStore } from 'solid-js';

function noop() {}

function Button(props: { onClick: () => void }) {
  return <button onClick={() => props.onClick()}>Save</button>;
}

const [handlers] = createStore({ click: noop });

export function App() {
  return <Button onClick={handlers.click} />;
}
