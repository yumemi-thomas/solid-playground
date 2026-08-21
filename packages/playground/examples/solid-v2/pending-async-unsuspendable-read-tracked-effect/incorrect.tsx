import { Loading, createMemo, createTrackedEffect } from 'solid-js';

const user = createMemo(async () => ({ name: 'Ada' }));

export function App() {
  // Tracked does not mean suspendable: this callback runs after the graph has
  // settled and cannot restart itself when the Promise resolves.
  createTrackedEffect(() => console.log(user().name));
  return <Loading fallback={<p>Loading</p>}><p>{user().name}</p></Loading>;
}
