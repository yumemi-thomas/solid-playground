import { createEffect, createMemo, createSignal } from 'solid-js';

interface User {
  name: string;
}

const [id] = createSignal('ada');

async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`/users/${userId}`);
  return response.json() as Promise<User>;
}

const user = createMemo(() => fetchUser(id()), { loadingValue: { name: 'anonymous' } });

// The compute phase is allowed to wait: it reads the accessor, suspends while
// the value is pending, and hands the settled value to the apply phase.
export function Analytics() {
  createEffect(
    () => user(),
    (resolved) => console.log(resolved.name),
  );
  return <div>{user().name}</div>;
}
