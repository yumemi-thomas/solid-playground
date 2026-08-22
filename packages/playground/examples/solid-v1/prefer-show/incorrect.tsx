import { createSignal } from 'solid-js';

const Dashboard = () => <section>dashboard</section>;
// Solid's compiler handles this correctly, so this is a readability
// preference rather than a runtime defect: `<Show>` makes the condition and the
// conditional DOM a named control-flow boundary.
export function Main() {
  const [ready] = createSignal(false);
  return <main>{ready() && <Dashboard />}</main>;
}
