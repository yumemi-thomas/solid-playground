import { onSettled } from 'solid-js';

// The callback runs, but its returned cleanup has no owner lifecycle to join.
onSettled(() => {
  const id = setInterval(() => console.log('poll'), 5000);
  return () => clearInterval(id);
});

export function App() {
  return <p>ready</p>;
}
