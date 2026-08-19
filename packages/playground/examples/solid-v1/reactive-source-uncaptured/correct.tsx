// `describe` stays in the project, so the checker reads its body: it can see that
// the accessor is not read at call time but closed over and read later, inside
// the JSX that consumes the returned function. Nothing is guessed.
import { createSignal, type Accessor } from 'solid-js';

const [count] = createSignal(0);

function describe(value: Accessor<number>) {
  return () => `count is ${value()}`;
}

const label = describe(count);

export function Counter() {
  return <span>{label()}</span>;
}
