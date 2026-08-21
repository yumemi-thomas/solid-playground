import { Loading, createMemo } from 'solid-js';

const user = createMemo(async () => ({ name: 'Ada' }));

export function App() {
  return <Loading fallback={<p>Loading</p>}><p>{user().name}</p></Loading>;
}
