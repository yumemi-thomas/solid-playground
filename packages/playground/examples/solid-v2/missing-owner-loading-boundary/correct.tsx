import { Loading } from 'solid-js';

export function App() {
  return (
    <Loading fallback={<p>Loading…</p>}>
      <p>Profile</p>
    </Loading>
  );
}
