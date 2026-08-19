import { createEffect, createSignal } from 'solid-js';

declare function applyTheme(value: string): void;

const [theme] = createSignal('light');

// Module scope has no owner, so nothing will ever dispose this effect: it keeps
// running and holding its subscriptions for the lifetime of the page.
createEffect(() => applyTheme(theme()));

export const themeName = () => theme();
