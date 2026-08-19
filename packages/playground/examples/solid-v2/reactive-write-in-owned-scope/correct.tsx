import { createSignal, onSettled } from 'solid-js';

// Imperative writes belong in imperative scopes. An event handler has no live
// owner, and `onSettled` is a leaf scope the guard exempts on purpose.
export function Counter() {
  const [count, setCount] = createSignal(0);
  const [ready, setReady] = createSignal(false);

  onSettled(() => {
    setReady(true);
  });

  return (
    <button onClick={() => setCount((previous) => previous + 1)}>
      {count()} {String(ready())}
    </button>
  );
}
