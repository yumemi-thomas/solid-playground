import { createMemo, createSignal } from 'solid-js';

interface User {
  name: string;
}

const [id] = createSignal('ada');

// sync: true promises an immediately available value, but this computation
// has a pending promise and no synchronous answer.
export const user = createMemo(
  async () => {
    const response = await fetch(`/users/${id()}`);
    return response.json() as Promise<User>;
  },
  { sync: true },
);

export function Profile() {
  return <h1>User profile</h1>;
}
