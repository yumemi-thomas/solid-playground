import { createRoot, onSettled } from 'solid-js';

export function App() {
  onSettled(() => {
    // A leaf owner cannot adopt another owner as a child.
    createRoot(() => console.log('child'));
  });
  return <p>ready</p>;
}
