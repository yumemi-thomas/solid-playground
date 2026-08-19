import { onSettled } from 'solid-js';

declare function poll(): void;

// Module scope has no owner to hold the returned cleanup, so the teardown is
// dropped on the floor and the interval runs forever.
onSettled(() => {
  const id = setInterval(poll, 5000);
  return () => clearInterval(id);
});

export const polling = true;
