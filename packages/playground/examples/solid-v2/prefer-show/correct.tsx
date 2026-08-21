import { Show, createSignal } from 'solid-js';

const [ready] = createSignal(false);

// Show makes the condition and its reactive boundary explicit.
export function Main() {
  return <main><Show when={ready()}><section>dashboard</section></Show></main>;
}
