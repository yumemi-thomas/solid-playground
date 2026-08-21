import { createEffect, createSignal } from 'solid-js';

declare function applyTheme(value: string): void;

const [theme] = createSignal('light');

// Module scope has no owner, so this subscription is never disposed.
createEffect(() => applyTheme(theme()));

export const themeName = () => theme();
