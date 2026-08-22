import { Show, createSignal } from 'solid-js';

const Dashboard = () => <section>dashboard</section>;
// The same condition, written as control flow.
export function Main() {
  const [ready] = createSignal(false);
  return (
    <main>
      <Show when={ready()}>
        <Dashboard />
      </Show>
    </main>
  );
}
