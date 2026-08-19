import { createSignal, flush, onSettled } from 'solid-js';

function measure() {
  console.log(document.body.clientHeight);
}

// `onSettled` runs as part of the flush cycle. Calling `flush()` from inside it
// asks the runtime to re-enter the cycle it is already in, and it throws.
export function Widget() {
  const [ready, setReady] = createSignal(false);

  onSettled(() => {
    setReady(true);
    flush();
    measure();
  });

  return <div>{String(ready())}</div>;
}
