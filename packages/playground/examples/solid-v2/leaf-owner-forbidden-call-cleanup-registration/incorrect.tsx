import { onCleanup, onSettled } from 'solid-js';

export function App() {
  onSettled(() => {
    // Leaf callbacks must return cleanup; they cannot register child cleanup.
    onCleanup(() => console.log('cleanup'));
  });
  return <p>ready</p>;
}
