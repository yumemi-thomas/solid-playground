import { createReaction, createResource, createSignal } from 'solid-js';

declare function fetchTotal(): Promise<number>;

// The resource is created in the component body, which can own it, and the
// reaction only reads its accessor.
function Total() {
  const [count] = createSignal(0);
  const [total] = createResource(fetchTotal);
  const track = createReaction(() => {
    console.log(total());
  });
  track(() => count());

  return <div>{count()}</div>;
}

export function App() {
  return <Total />;
}
