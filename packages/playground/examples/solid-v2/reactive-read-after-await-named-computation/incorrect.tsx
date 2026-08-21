import { createMemo, createSignal } from 'solid-js';

const [userId] = createSignal('ada');

// Passing a named function can hide the reactive computation boundary from a
// syntax-only rule, but the read still happens after tracking has ended.
async function loadGreeting() {
  await Promise.resolve();
  return `Hello ${userId()}`;
}

const greeting = createMemo(loadGreeting);

export function App() {
  return <p>{greeting()}</p>;
}
