import { createEffect, createSignal } from 'solid-js';

const [name] = createSignal('Ada');

function trackName() {
  return name();
}

export function Logger() {
  // Naming the compute callback does not supply the missing apply callback.
  createEffect(trackName);
  return <div>{name()}</div>;
}
