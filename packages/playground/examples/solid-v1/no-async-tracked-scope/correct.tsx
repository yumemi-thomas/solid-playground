import { createEffect, createResource, createSignal } from 'solid-js';

declare function fetchData(): Promise<string>;
declare function paint(data: string, theme: string): void;

const [theme] = createSignal('light');

// The async work moves into `createResource`, whose source function stays
// tracked and re-triggers the fetcher. The effect stays synchronous and simply
// reads the resulting accessor.
const [data] = createResource(theme, async () => fetchData());

function Canvas() {
  createEffect(() => {
    const value = data();
    if (value) paint(value, theme());
  });
  return <div>{theme()}</div>;
}

export function App() {
  return <Canvas />;
}
