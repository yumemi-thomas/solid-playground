import { createEffect, createRoot, createSignal } from 'solid-js';

declare function applyTheme(value: string): void;

const [theme] = createSignal('light');

// Inside a component the component owns the effect and disposes it on unmount.
function ThemeProvider() {
  createEffect(() => applyTheme(theme()));
  return <div>{theme()}</div>;
}

// Deliberate module-scope reactivity keeps an explicit root and its dispose
// handle: a 1.x root is detached from any surrounding owner, so nothing calls
// dispose for you.
export const disposeTheme = createRoot((dispose) => {
  createEffect(() => applyTheme(theme()));
  return dispose;
});

export function App() {
  return <ThemeProvider />;
}
