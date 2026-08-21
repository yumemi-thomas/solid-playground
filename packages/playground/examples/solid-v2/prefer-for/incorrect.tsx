import { createSignal } from 'solid-js';

const [items] = createSignal([{ id: 'a', name: 'Ada' }]);

// A reactive mapped array recreates its output instead of giving Solid explicit
// list identity and update semantics.
export function List() {
  return <ul>{items().map((item) => <li>{item.name}</li>)}</ul>;
}
