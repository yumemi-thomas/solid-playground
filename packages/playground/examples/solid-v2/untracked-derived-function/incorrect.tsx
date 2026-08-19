import { createSignal } from 'solid-js';

// `doubled` derives from `count`, and its only call is a plain statement in the
// component body — a scope that tracks nothing. The derivation reads once,
// subscribes to nothing, and never runs again.
export function Total() {
  const [count] = createSignal(0);
  const doubled = () => count() * 2;

  console.log(doubled());

  return <div>total</div>;
}
