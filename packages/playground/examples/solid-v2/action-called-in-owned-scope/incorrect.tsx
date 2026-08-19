import { action, createSignal } from 'solid-js';

const [saved, setSaved] = createSignal(0);

const save = action(function* (amount: number) {
  yield Promise.resolve();
  setSaved(amount);
});

// Calling the action during setup starts a transaction while the component's
// owner is still live, which is the same feedback loop a bare write would be.
export function SaveOnMount() {
  save(1);
  return <span>{saved()}</span>;
}
