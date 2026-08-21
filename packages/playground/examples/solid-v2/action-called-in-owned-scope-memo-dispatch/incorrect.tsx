import { action, createMemo, createSignal } from 'solid-js';

const [value] = createSignal('Ada');
const save = action(function* (name: string) {
  yield Promise.resolve();
  console.log(name);
});

// Memos are computations, not imperative boundaries. Starting an action here
// adds a write transaction to the graph that is currently evaluating it.
const result = createMemo(() => {
  save(value());
  return value();
});

export function App() {
  return <output>{result()}</output>;
}
