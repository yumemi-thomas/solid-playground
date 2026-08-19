import { createRoot, onSettled } from 'solid-js';

declare function poll(): void;

// A component body has a live owner, which holds the returned cleanup and runs
// it on unmount.
export function Poller() {
  onSettled(() => {
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  });
  return <div>polling</div>;
}

// For deliberate standalone setup, keep an explicit root and its dispose
// handle, and call it when the setup should end.
export const stopPolling = createRoot((dispose) => {
  onSettled(() => {
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  });
  return dispose;
});
