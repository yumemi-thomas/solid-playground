import { createEffect, createMemo, createSignal } from 'solid-js';

declare function sync(value: string): void;
declare function search(term: string): string[];

const [user] = createSignal('ada');
const [query] = createSignal('');

// Dropping the array is the whole fix: the reads inside the callback already are
// the dependency list. When tracking really has to be narrowed, Solid 1.x's
// `on(source, callback)` helper says so explicitly, inside the primitive.
function Panel() {
  createEffect(() => sync(user()));
  const results = createMemo(() => search(query()));
  return <div>{results().length}</div>;
}

export function App() {
  return <Panel />;
}
