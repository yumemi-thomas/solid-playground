import { Loading, createMemo } from 'solid-js';

const first = createMemo(async () => 'first');
const second = createMemo(async () => 'second');

export function App() {
  return (
    <Loading fallback={<p>Loading data</p>}>
      <p>{first()}</p>
      <p>{second()}</p>
    </Loading>
  );
}
