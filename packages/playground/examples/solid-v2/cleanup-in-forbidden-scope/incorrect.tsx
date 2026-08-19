import { onCleanup, onSettled } from 'solid-js';

declare function tick(): void;

// Inside a component body `onSettled` is owner-backed, which makes it a leaf
// owner: it cannot own children, so registering an `onCleanup` there throws in
// dev instead of scheduling the teardown.
export function Widget() {
  onSettled(() => {
    const id = setInterval(tick, 1000);
    onCleanup(() => clearInterval(id));
  });

  return <div>ticking</div>;
}
