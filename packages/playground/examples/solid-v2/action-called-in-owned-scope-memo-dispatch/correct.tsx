import { action, createMemo, createSignal } from 'solid-js';

const [value] = createSignal('Ada');
const save = action(function* (name: string) {
  yield Promise.resolve();
  console.log(name);
});
const result = createMemo(() => value());

export function App() {
  return <button onClick={() => save(value())}>{result()}</button>;
}
