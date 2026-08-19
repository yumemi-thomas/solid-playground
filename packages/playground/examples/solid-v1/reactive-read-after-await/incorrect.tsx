import { createMemo, createSignal } from 'solid-js';

const [userId, setUserId] = createSignal('ada');

async function loadGreeting(): Promise<string> {
  const response = await fetch('/greeting');
  return response.text();
}

// Tracking stops at the first `await`. `userId()` is read in the continuation,
// where nothing is subscribing, so selecting another user never re-runs this
// memo and the greeting keeps the name it was first computed with.
export const greeting = createMemo(async () => {
  const template = await loadGreeting();
  return `${template}, ${userId()}`;
});

export function selectUser(next: string) {
  setUserId(next);
}
