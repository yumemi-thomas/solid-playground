import { createReaction, createSignal, onCleanup } from 'solid-js';

declare function tick(): void;

// A `createReaction` callback is a leaf: it owns nothing, so the cleanup
// registered inside it is never run and the interval survives disposal.
function Ticker() {
  const [count] = createSignal(0);
  const track = createReaction(() => {
    const id = setInterval(tick, 1000);
    onCleanup(() => clearInterval(id));
  });
  track(() => count());

  return <div>{count()}</div>;
}

export function App() {
  return <Ticker />;
}
