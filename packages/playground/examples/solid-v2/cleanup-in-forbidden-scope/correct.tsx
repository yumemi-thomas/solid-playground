import { onSettled } from 'solid-js';

declare function tick(): void;

// A leaf owner takes its teardown as the callback's return value. Do the setup,
// then return the function that undoes it.
export function Widget() {
  onSettled(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  });

  return <div>ticking</div>;
}
