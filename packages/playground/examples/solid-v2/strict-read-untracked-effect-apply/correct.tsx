import { createEffect, createStore } from 'solid-js';

const [settings] = createStore({ enabled: true, theme: 'light' });

export function App() {
  createEffect(
    // Capture every reactive dependency in compute.
    () => ({ enabled: settings.enabled, theme: settings.theme }),
    ({ enabled, theme }) => console.log(enabled, theme),
  );
  return <p>{settings.theme}</p>;
}
