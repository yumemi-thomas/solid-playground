import { createEffect, createSignal } from 'solid-js';

declare function applyTheme(value: string): void;

const [theme] = createSignal('light');

function ThemeProvider() {
  createEffect(() => applyTheme(theme()));
  return <div>{theme()}</div>;
}

export function App() {
  return <ThemeProvider />;
}
