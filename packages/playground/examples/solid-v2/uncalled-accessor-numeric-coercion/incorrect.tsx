import { createSignal } from 'solid-js';

const [count] = createSignal(3);

// Unary + coerces the accessor function, not the number held by the signal.
const amount: number = +count;

export function App() {
  return <output>{amount}</output>;
}
