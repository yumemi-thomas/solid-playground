import { onSettled } from 'solid-js';

export function App() {
  onSettled(() => console.log('settled'));
  return <p>ready</p>;
}
