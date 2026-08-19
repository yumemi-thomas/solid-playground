import { createEffect, createMemo, createSignal } from 'solid-js';

declare function sync(value: string): void;
declare function search(term: string): string[];

const [user] = createSignal('ada');
const [query] = createSignal('');

// Solid discovers dependencies from the reactive reads the callback performs.
// The second argument is the initial `prev` value, not a dependency list, so a
// React-shaped array changes the callback's state without narrowing tracking —
// while reading as though it did.
function Panel() {
  createEffect(() => sync(user()), [user]);
  const results = createMemo(() => search(query()), [query]);
  return <div>{results().length}</div>;
}

export function App() {
  return <Panel />;
}
