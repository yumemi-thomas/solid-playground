import { For, createSignal } from 'solid-js';

// `<For>` keys DOM identity by item, so an item that did not change keeps its
// node. Use `<Index>` instead when positions are stable and the item value
// should be an accessor.
export function List() {
  const [items] = createSignal([{ id: 'a', name: 'Ada' }]);
  return (
    <ul>
      <For each={items()}>{(item) => <li>{item.name}</li>}</For>
    </ul>
  );
}
