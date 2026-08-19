import { onCleanup } from 'solid-js';

declare function onResize(): void;

function listen(type: string, handler: () => void) {
  window.addEventListener(type, handler);
  onCleanup(() => window.removeEventListener(type, handler));
}

// Called from module scope, where no owner exists: the cleanup is never
// registered, so the listener outlives everything.
listen('resize', onResize);

export const installed = true;
