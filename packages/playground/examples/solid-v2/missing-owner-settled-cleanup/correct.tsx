import { onSettled } from 'solid-js';

export function App() {
  onSettled(() => {
    const id = setInterval(() => console.log('poll'), 5000);
    return () => clearInterval(id);
  });
  return <p>ready</p>;
}
