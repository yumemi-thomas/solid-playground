import { createSignal, flush, onSettled } from 'solid-js';

function measure() {
  console.log(document.body.clientHeight);
}

// Inside `onSettled` the graph has already settled, so there is nothing to
// flush — just read. When a write really must be observed synchronously, do
// both at the imperative boundary that triggered it.
export function Widget() {
  const [ready, setReady] = createSignal(false);

  onSettled(() => {
    measure();
  });

  return (
    <button
      onClick={() => {
        setReady(true);
        flush();
        measure();
      }}
    >
      {String(ready())}
    </button>
  );
}
