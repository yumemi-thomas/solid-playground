import { createTrackedEffect } from 'solid-js';

// Module scope has no owner. This effect survives every app lifetime and can
// never be disposed with the component tree.
createTrackedEffect(() => console.log('outside owner'));

export function App() {
  return <p>ready</p>;
}
