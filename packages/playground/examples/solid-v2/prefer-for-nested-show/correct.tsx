import { For, Show, createSignal } from 'solid-js';

const [items] = createSignal([{ id: 'a', name: 'Ada' }]);
const [ready] = createSignal(true);

// Show owns the condition and For owns the reactive list identity.
export function List() {
  return (
    <Show when={ready()}>
      <ul>
        <For each={items()}>{(item) => <li>{item.name}</li>}</For>
      </ul>
    </Show>
  );
}
