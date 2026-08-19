import { createSignal, onMount } from 'solid-js';

// Imperative writes belong in imperative scopes: an event handler, or `onMount`
// for one-time setup, which runs after render rather than during it.
export function Counter() {
  const [count, setCount] = createSignal(0);
  const [ready, setReady] = createSignal(false);

  onMount(() => setReady(true));

  return (
    <button onClick={() => setCount((previous) => previous + 1)}>
      {count()} {String(ready())}
    </button>
  );
}
