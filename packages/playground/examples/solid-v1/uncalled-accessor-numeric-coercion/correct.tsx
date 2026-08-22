import { createSignal } from 'solid-js';

const [count] = createSignal(3);
const amount: number = +count();

export function App() {
  return <output>{amount}</output>;
}
