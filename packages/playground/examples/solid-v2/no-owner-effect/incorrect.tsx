import { createEffect, createSignal } from 'solid-js';

declare function applyTheme(value: string): void;

const [theme] = createSignal('light');

// Module scope has no owner, so nothing will ever dispose this effect: it keeps
// its subscription for the lifetime of the page.
createEffect(
  () => theme(),
  (value) => applyTheme(value),
);

export const themeName = () => theme();
