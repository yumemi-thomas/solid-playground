import { For, createSignal } from 'solid-js';

const [items] = createSignal([
  { id: 1, visible: true },
  { id: 2, visible: false },
]);

export function App() {
  return (
    <For each={items().filter((item) => item.visible)}>
      {(item) => <li>{item.id}</li>}
    </For>
  );
}
