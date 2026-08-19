import { createEffect, createSignal } from 'solid-js';

const [name] = createSignal('Ada');

// compute tracks and returns a value; apply performs the side effect untracked
// after the flush, and may return a cleanup.
export function Logger() {
  createEffect(
    () => name(),
    (value) => {
      const id = setInterval(() => console.log(value), 1000);
      return () => clearInterval(id);
    },
  );
  return <div>{name()}</div>;
}
