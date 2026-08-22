import { Show, createSignal } from 'solid-js';

const [ready] = createSignal(true);

export function App() {
  return (
    <main>
      <Show when={ready()} fallback={<p>Waiting</p>}>
        <p>Ready</p>
      </Show>
    </main>
  );
}
