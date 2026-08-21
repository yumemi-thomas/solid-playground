import { createMemo, createSignal } from 'solid-js';

const [userId] = createSignal('ada');

// Capture the reactive dependency before the await. The continuation uses the
// stable snapshot, while the memo remains subscribed to userId.
async function loadGreeting() {
  const id = userId();
  await Promise.resolve();
  return `Hello ${id}`;
}

const greeting = createMemo(loadGreeting);

export function App() {
  return <p>{greeting()}</p>;
}
