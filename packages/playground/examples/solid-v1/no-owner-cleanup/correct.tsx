import { createRoot, onCleanup } from 'solid-js';

declare function onResize(): void;

function listen(type: string, handler: () => void) {
  window.addEventListener(type, handler);
  onCleanup(() => window.removeEventListener(type, handler));
}

// Called during component setup, the component owns the cleanup.
function Tracker() {
  listen('resize', onResize);
  return <div>tracking</div>;
}

// Module-scope setup gets an explicit root, so disposal exists.
export const disposeTracker = createRoot((dispose) => {
  listen('resize', onResize);
  return dispose;
});

export function App() {
  return <Tracker />;
}
