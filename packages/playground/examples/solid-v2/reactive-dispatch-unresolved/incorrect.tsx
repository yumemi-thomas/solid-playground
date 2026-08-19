import { createSignal, createTrackedEffect } from 'solid-js';

const [count, setCount] = createSignal(0);

function wrapCallback(callback: () => void) {
  return callback;
}

// The arrow is `wrapCallback`'s argument, not the leaf owner's callback:
// `wrapCallback` decides whether and where it runs. Nothing here proves the body
// executes in the leaf scope, so the checker refuses to claim a specific
// leaf-owner defect and refuses to certify the callback either.
export function Ticker() {
  createTrackedEffect(
    wrapCallback(() => {
      setCount((previous) => previous + 1);
    }),
  );
  return <span>{count()}</span>;
}
