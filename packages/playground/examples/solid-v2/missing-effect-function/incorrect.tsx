import { createEffect, createSignal } from 'solid-js';

const [name] = createSignal('Ada');

// The Solid 1.x shape: one callback that both tracks and acts. Solid 2.0 splits
// those phases, so the apply function is simply missing here.
export function Logger() {
  createEffect(() => {
    console.log(name());
  });
  return <div>{name()}</div>;
}
