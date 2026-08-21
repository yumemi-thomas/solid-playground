import { Loading, createEffect, createSignal, onCleanup, onSettled } from 'solid-js';

declare function applyTheme(value: string): void;
declare function poll(): void;

const [theme] = createSignal('light');

export function App() {
  createEffect(() => theme(), (value) => applyTheme(value));
  onCleanup(() => applyTheme('disposed'));
  onSettled(() => {
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  });
  return <Loading fallback={<span>Loading…</span>}><p>{theme()}</p></Loading>;
}
