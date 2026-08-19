import { createEffect, createSignal, onCleanup } from 'solid-js';

const [name] = createSignal('Ada');

// The effect function is the first argument. The optional second argument is a
// value — the initial `prev` — not a second callback, and cleanup is registered
// with `onCleanup` rather than returned.
function Logger() {
  createEffect(() => {
    const id = setInterval(() => console.log(name()), 1000);
    onCleanup(() => clearInterval(id));
  });

  createEffect((previous: number) => previous + 1, 0);

  return <div>{name()}</div>;
}

export function App() {
  return <Logger />;
}
