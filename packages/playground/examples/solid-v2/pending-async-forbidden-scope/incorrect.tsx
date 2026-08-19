import { createMemo, createSignal, onSettled } from 'solid-js';

interface User {
  name: string;
}

const [id] = createSignal('ada');

async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`/users/${userId}`);
  return response.json() as Promise<User>;
}

// The declared first paint means readers never suspend on the first flight, so
// this source can be rendered bare. It does not help a leaf owner: `onSettled`
// cannot wait for anything, so once a later request is in flight the read
// throws there.
const user = createMemo(() => fetchUser(id()), { loadingValue: { name: 'anonymous' } });

export function Analytics() {
  onSettled(() => {
    console.log(user().name);
  });
  return <div>{user().name}</div>;
}
