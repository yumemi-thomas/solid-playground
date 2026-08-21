import { flush, onSettled } from 'solid-js';

export function App() {
  onSettled(() => flush());
  return <p>ready</p>;
}
