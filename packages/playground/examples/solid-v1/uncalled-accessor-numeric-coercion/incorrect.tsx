import { createSignal } from 'solid-js';

const [count] = createSignal(3);

// Unary + accepts the accessor function but produces NaN instead of its value.
const amount: number = +count;

export function App() {
  return <output>{amount}</output>;
}
