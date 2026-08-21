import { createEffect, createSignal } from 'solid-js';

const [name] = createSignal('Ada');

function trackName() {
  return name();
}

export function Logger() {
  createEffect(trackName, (value) => console.log(value));
  return <div>{name()}</div>;
}
