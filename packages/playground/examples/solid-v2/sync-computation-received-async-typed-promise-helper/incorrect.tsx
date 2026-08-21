import { Loading, createMemo, createSignal } from 'solid-js';

const [id] = createSignal('ada');

function load(userId: string): Promise<string> {
  return fetch(`/users/${userId}`).then((response) => response.text());
}

export function App() {
  // The Promise is hidden behind a typed helper, but sync: true still makes a
  // runtime guarantee the checker can prove false from the return type.
  const value = createMemo(() => load(id()), { sync: true });
  return <Loading fallback={<p>Loading</p>}><output>{value()}</output></Loading>;
}
