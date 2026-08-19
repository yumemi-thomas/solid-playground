import { Loading, createMemo } from 'solid-js';
import { renderToStream } from '@solidjs/web';

function measureViewport() {
  return window.innerWidth;
}

const width = createMemo(() => measureViewport(), { ssrSource: 'client' });

// The boundary owns the position's fallback: the server flushes the fallback and
// the client renders the real branch after hydration.
export function Dashboard() {
  return (
    <Loading fallback={<span>Measuring…</span>}>
      <div>{width()}</div>
    </Loading>
  );
}

// Declaring a first paint removes the hole too: the server renders the declared
// value instead of suspending, so this read needs no boundary.
const draft = createMemo(() => window.localStorage.getItem('draft'), {
  ssrSource: 'client',
  loadingValue: null,
});

export function Editor() {
  return <div>{draft() ?? 'No draft yet'}</div>;
}

export const server = { render: renderToStream };
