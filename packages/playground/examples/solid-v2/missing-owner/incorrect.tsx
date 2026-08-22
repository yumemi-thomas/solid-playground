import { createEffect, createSignal } from 'solid-js';

declare function applyTheme(value: string): void;

const [theme] = createSignal('light');

// Module scope has no owner, so this subscription survives for the lifetime of
// the app and can never be disposed with a component tree.
createEffect(
  () => theme(),
  (value) => applyTheme(value),
);

export const themeName = () => theme();
