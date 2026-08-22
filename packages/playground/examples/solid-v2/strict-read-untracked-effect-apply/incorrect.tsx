import { createEffect, createStore } from 'solid-js';

const [settings] = createStore({ enabled: true, theme: 'light' });

export function App() {
  createEffect(
    () => settings.enabled,
    () => {
      // Apply runs untracked, so this separate store read never subscribes.
      console.log(settings.theme);
    },
  );
  return <p>{settings.theme}</p>;
}
