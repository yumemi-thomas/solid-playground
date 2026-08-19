import { Show, createSignal } from 'solid-js';

const Dashboard = () => <section>dashboard</section>;
const Login = () => <section>login</section>;

// The same two conditions, written as control flow.
export function Main() {
  const [ready] = createSignal(false);
  const [user] = createSignal<string | null>(null);
  return (
    <main>
      <Show when={ready()}>
        <Dashboard />
      </Show>
      <Show when={user()} fallback={<Login />}>
        <Dashboard />
      </Show>
    </main>
  );
}
