import { createReaction, createSignal, onCleanup } from 'solid-js';

const [count] = createSignal(0);

// The callback the reaction receives is written in place, so its body is exactly
// what the checker inspects — and the cleanup is registered in the computation
// that owns the reaction, where it actually runs.
function Ticker() {
  const track = createReaction(() => console.log('count changed'));
  track(() => count());

  onCleanup(() => console.log('disposed'));

  return <span>{count()}</span>;
}

export function App() {
  return <Ticker />;
}
