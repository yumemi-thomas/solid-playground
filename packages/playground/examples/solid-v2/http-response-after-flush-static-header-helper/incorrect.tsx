import { Loading, createMemo } from 'solid-js';
import { httpHeader, renderToStream } from '@solidjs/web';

const data = createMemo(async () => 'ready');

function Headline() {
  // This helper is below Loading, so streaming may already have committed the
  // response head before this branch gets to run.
  httpHeader('x-title', 'ready');
  return <h1>{data()}</h1>;
}

export function App() {
  return <Loading fallback={<p>Loading</p>}><Headline /></Loading>;
}

export function serve() {
  return renderToStream(() => <App />);
}
