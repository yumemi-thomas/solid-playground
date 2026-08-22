import { onCleanup } from 'solid-js';

export function App() {
  onCleanup(() => console.log('disposed'));
  return <p>ready</p>;
}
