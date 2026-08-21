import { Loading, createMemo } from 'solid-js';
import { httpHeader, renderToStream } from '@solidjs/web';

const data = createMemo(async () => 'ready');

function Headline() {
  return <h1>{data()}</h1>;
}

export function App() {
  // Decide response metadata before entering the async boundary.
  httpHeader('x-title', 'ready');
  return <Loading fallback={<p>Loading</p>}><Headline /></Loading>;
}

export function serve() {
  return renderToStream(() => <App />);
}
