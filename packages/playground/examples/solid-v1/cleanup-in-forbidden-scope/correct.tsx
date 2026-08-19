import { createReaction, createSignal, onCleanup } from 'solid-js';

declare function tick(): void;

// The cleanup is registered in the computation that owns the reaction — the
// component body — so disposal really does clear the interval. Returning a
// function from the reaction callback is not a cleanup mechanism in Solid 1.x.
function Ticker() {
  const [count] = createSignal(0);
  const track = createReaction(() => console.log('count changed'));
  track(() => count());

  const id = setInterval(tick, 1000);
  onCleanup(() => clearInterval(id));

  return <div>{count()}</div>;
}

export function App() {
  return <Ticker />;
}
