import { createReaction, createSignal, onCleanup } from 'solid-js';

const [count] = createSignal(0);

function wrapCallback(callback: () => void) {
  return callback;
}

// The arrow is `wrapCallback`'s argument, not the reaction's callback:
// `wrapCallback` decides whether and where it runs. Nothing here proves the body
// executes in the leaf scope, so the checker refuses to claim a specific
// leaf-owner defect and refuses to certify the callback either.
function Ticker() {
  const track = createReaction(
    wrapCallback(() => {
      onCleanup(() => console.log('disposed'));
    }),
  );
  track(() => count());

  return <span>{count()}</span>;
}

export function App() {
  return <Ticker />;
}
