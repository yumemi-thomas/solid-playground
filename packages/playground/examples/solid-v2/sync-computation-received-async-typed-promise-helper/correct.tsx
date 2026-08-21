import { Loading, createMemo, createSignal } from 'solid-js';

const [id] = createSignal('ada');

function load(userId: string): Promise<string> {
  return fetch(`/users/${userId}`).then((response) => response.text());
}

export function App() {
  const value = createMemo(() => load(id()));
  return <Loading fallback={<p>Loading</p>}><output>{value()}</output></Loading>;
}
