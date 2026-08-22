import { onCleanup } from 'solid-js';

// There is no owner whose disposal could run this callback.
onCleanup(() => console.log('disposed'));

export function App() {
  return <p>ready</p>;
}
