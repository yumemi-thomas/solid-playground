import { onSettled } from 'solid-js';

export function App() {
  onSettled(() => () => console.log('cleanup'));
  return <p>ready</p>;
}
