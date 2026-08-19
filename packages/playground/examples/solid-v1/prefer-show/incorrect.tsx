import { createSignal } from 'solid-js';

const Dashboard = () => <section>dashboard</section>;
const Login = () => <section>login</section>;

// Solid's compiler handles both of these correctly, so this is a readability
// preference rather than a runtime defect: `<Show>` makes the condition and the
// fallback explicit and gives the conditional DOM a named control-flow boundary.
export function Main() {
  const [ready] = createSignal(false);
  const [user] = createSignal<string | null>(null);
  return (
    <main>
      {ready() && <Dashboard />}
      {user() ? <Dashboard /> : <Login />}
    </main>
  );
}
