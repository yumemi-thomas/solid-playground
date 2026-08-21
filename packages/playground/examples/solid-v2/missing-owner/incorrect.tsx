import { Loading, createEffect, createSignal, onCleanup, onSettled } from 'solid-js';

declare function applyTheme(value: string): void;
declare function poll(): void;

const [theme] = createSignal('light');

// All four operations run at module scope, where no owner can dispose them.
createEffect(() => theme(), (value) => applyTheme(value));
onCleanup(() => applyTheme('disposed'));
onSettled(() => {
  const id = setInterval(poll, 5000);
  return () => clearInterval(id);
});

export const orphanBoundary = <Loading fallback={<span>Loading…</span>}><p>Profile</p></Loading>;
