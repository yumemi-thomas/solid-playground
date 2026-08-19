import { createMemo, createSignal } from 'solid-js';

const [userId, setUserId] = createSignal('ada');

async function loadGreeting(): Promise<string> {
  const response = await fetch('/greeting');
  return response.text();
}

// Every reactive input is read before the first `await` and carried through the
// async work, so the memo really depends on `userId` and re-runs when it moves.
export const greeting = createMemo(async () => {
  const id = userId();
  const template = await loadGreeting();
  return `${template}, ${id}`;
});

export function selectUser(next: string) {
  setUserId(next);
}
