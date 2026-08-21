import { createSignal } from 'solid-js';

const [items] = createSignal([
  { id: 1, visible: true },
  { id: 2, visible: false },
]);

export function App() {
  return <>{items().filter((item) => item.visible).map((item) => <li>{item.id}</li>)}</>;
}
