import { createReaction, createResource, createSignal } from 'solid-js';

declare function fetchTotal(): Promise<number>;

// A `createReaction` callback is a leaf owner: it cannot own children. The
// resource created inside it attaches to nothing, so it is never tracked and
// never disposed.
function Total() {
  const [count] = createSignal(0);
  const track = createReaction(() => {
    createResource(fetchTotal);
  });
  track(() => count());

  return <div>{count()}</div>;
}

export function App() {
  return <Total />;
}
