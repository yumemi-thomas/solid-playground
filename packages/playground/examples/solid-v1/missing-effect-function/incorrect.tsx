import { createEffect, createSignal } from 'solid-js';

const [name] = createSignal('Ada');

// `createEffect` takes the effect *function* as its first argument. The
// assertion hides a non-callable value from TypeScript, and the runtime has
// nothing to call.
function Logger() {
  createEffect(123 as unknown as () => void);
  return <div>{name()}</div>;
}

export function App() {
  return <Logger />;
}
