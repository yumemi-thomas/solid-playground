import { createEffect, createRoot, createSignal } from 'solid-js';

declare function applyTheme(value: string): void;

const [theme] = createSignal('light');

// Inside a component the component owns the effect and disposes it on unmount.
export function ThemeProvider() {
  createEffect(
    () => theme(),
    (value) => applyTheme(value),
  );
  return <div>{theme()}</div>;
}

// Deliberate module-scope reactivity keeps an explicit root and its handle, so
// the subscription has an owner and a way to end.
export const disposeTheme = createRoot((dispose) => {
  createEffect(
    () => theme(),
    (value) => applyTheme(value),
  );
  return dispose;
});
