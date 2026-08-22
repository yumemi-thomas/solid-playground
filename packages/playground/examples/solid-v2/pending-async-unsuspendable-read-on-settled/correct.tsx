import { Loading, createMemo } from 'solid-js';

const user = createMemo(async () => ({ name: 'Ada' }));

export function App() {
  // Keep pending reads in tracked JSX so the boundary can suspend and retry.
  return (
    <Loading fallback={<p>Loading…</p>}>
      <p>{user().name}</p>
    </Loading>
  );
}
