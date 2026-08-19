import { createResource, createSignal } from 'solid-js';

const [userId, setUserId] = createSignal('ada');

async function loadGreeting(): Promise<string> {
  const response = await fetch('/greeting');
  return response.text();
}

// `createResource` owns the async work: its source function stays tracked, and
// the fetcher re-runs with the latest source value whenever it changes.
export const [greeting] = createResource(userId, async (id) => {
  const template = await loadGreeting();
  return `${template}, ${id}`;
});

export function selectUser(next: string) {
  setUserId(next);
}
