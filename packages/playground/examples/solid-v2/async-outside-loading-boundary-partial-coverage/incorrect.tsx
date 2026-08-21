import { Loading, createMemo } from 'solid-js';

const first = createMemo(async () => 'first');
const second = createMemo(async () => 'second');

export function App() {
  return (
    <>
      <p>{first()}</p>
      <Loading fallback={<p>Loading second</p>}>
        <p>{second()}</p>
      </Loading>
    </>
  );
}
