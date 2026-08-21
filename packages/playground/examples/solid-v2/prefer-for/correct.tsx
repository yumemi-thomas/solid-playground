import { For, createSignal } from 'solid-js';

const [items] = createSignal([{ id: 'a', name: 'Ada' }]);

// For owns list identity and updates each item without rebuilding the array.
export function List() {
  return <ul><For each={items()}>{(item) => <li>{item.name}</li>}</For></ul>;
}
