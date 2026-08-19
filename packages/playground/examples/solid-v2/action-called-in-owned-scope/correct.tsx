import { action, createSignal } from 'solid-js';

const [saved, setSaved] = createSignal(0);

const save = action(function* (amount: number) {
  yield Promise.resolve();
  setSaved(amount);
});

// An event handler is an imperative boundary: no owner is live, so starting a
// transaction there is exactly what actions are for.
export function SaveButton() {
  return <button onClick={() => save(1)}>Save {saved()}</button>;
}
