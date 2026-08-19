import { createSignal } from 'solid-js';

// A mapped array recreates its whole output whenever the surrounding expression
// runs, because the array itself is a new value every time. `Array#map` cannot
// tell Solid which DOM node belongs to which item.
export function List() {
  const [items] = createSignal([{ id: 'a', name: 'Ada' }]);
  return <ul>{items().map((item) => <li>{item.name}</li>)}</ul>;
}
