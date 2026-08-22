import { createEffect, createSignal } from 'solid-js';

const [name] = createSignal('Ada');

// The callable effect function is the first argument and reads the dependency
// Solid should track.
function Logger() {
  createEffect(() => {
    console.log(name());
  });

  return <div>{name()}</div>;
}

export function App() {
  return <Logger />;
}
