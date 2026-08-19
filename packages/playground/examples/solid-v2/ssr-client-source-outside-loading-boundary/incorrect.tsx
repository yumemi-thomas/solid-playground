import { createMemo } from 'solid-js';
import { renderToStream } from '@solidjs/web';

function measureViewport() {
  return window.innerWidth;
}

// `ssrSource: "client"` tells the server to skip the compute, and nothing here
// declares what to render in its place. The compute is fully synchronous, so no
// async rule can see the hole — the server has nothing to put in this position
// and throws.
const width = createMemo(() => measureViewport(), { ssrSource: 'client' });

export function Dashboard() {
  return <div>{width()}</div>;
}

// A visible server entry point is what proves this project server-renders.
export const server = { render: renderToStream };
