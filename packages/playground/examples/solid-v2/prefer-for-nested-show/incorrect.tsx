import { Show, createSignal } from 'solid-js';

const [items] = createSignal([{ id: 'a', name: 'Ada' }]);
const [ready] = createSignal(true);

// Nesting map inside another control-flow component does not give the list
// stable row identity. The compiler still sees a reactive array rendered by
// map and can recommend For at the exact list expression.
export function List() {
  return (
    <Show when={ready()}>
      <ul>{items().map((item) => <li>{item.name}</li>)}</ul>
    </Show>
  );
}
