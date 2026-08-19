import { createSignal } from 'solid-js';

// Called from JSX, the derived function runs inside a tracking scope, so its
// read of `count` subscribes and the text updates.
export function Total() {
  const [count] = createSignal(0);
  const doubled = () => count() * 2;

  return <div>{doubled()}</div>;
}
