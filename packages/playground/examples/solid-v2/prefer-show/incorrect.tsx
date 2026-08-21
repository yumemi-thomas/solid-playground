import { createSignal } from 'solid-js';

const [ready] = createSignal(false);

// The reactive condition controls expensive JSX directly instead of making the
// control-flow boundary explicit.
export function Main() {
  return <main>{ready() && <section>dashboard</section>}</main>;
}
