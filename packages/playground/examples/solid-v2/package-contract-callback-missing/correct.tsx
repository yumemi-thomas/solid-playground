// Keeping the helper in the project is the fix that needs no contract: the
// checker reads `withRetry`'s body, so when and how it runs the callback is a
// fact rather than an assumption, and the write inside the callback is judged
// against the scope it actually executes in.
import { createSignal } from 'solid-js';

const [attempts, setAttempts] = createSignal(0);

function withRetry(work: () => void) {
  work();
}

export function RetryButton() {
  return <button onClick={() => withRetry(() => setAttempts((previous) => previous + 1))}>Retry {attempts()}</button>;
}
