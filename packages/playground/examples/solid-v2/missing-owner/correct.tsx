import { createEffect, createSignal } from 'solid-js';

declare function applyTheme(value: string): void;

const [theme] = createSignal('light');

export function App() {
  createEffect(
    () => theme(),
    (value) => applyTheme(value),
  );
  return <p>{theme()}</p>;
}
