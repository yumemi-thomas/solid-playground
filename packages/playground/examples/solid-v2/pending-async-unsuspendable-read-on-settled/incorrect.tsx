import { Loading, createMemo, onSettled } from 'solid-js';

const user = createMemo(async () => ({ name: 'Ada' }));

export function App() {
  // onSettled is a leaf scope and cannot suspend until user is ready.
  onSettled(() => console.log(user().name));
  return (
    <Loading fallback={<p>Loading…</p>}>
      <p>{user().name}</p>
    </Loading>
  );
}
