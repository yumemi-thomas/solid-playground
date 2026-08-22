import { createSignal } from 'solid-js';

const [ready] = createSignal(true);

export function App() {
  return <main>{ready() ? <p>Ready</p> : <p>Waiting</p>}</main>;
}
