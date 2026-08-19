import { createEffect, createSignal } from 'solid-js';

declare function fetchData(): Promise<string>;
declare function paint(data: string, theme: string): void;

const [theme] = createSignal('light');

// A tracked scope has to be synchronous: tracking ends at the first `await`, so
// `theme()` is read where nothing subscribes and never becomes a dependency.
// The async shape is this rule; the stale read after the `await` is reported
// separately by `v1/reactive-read-after-await`.
function Canvas() {
  createEffect(async () => {
    const data = await fetchData();
    paint(data, theme());
  });
  return <div>{theme()}</div>;
}

export function App() {
  return <Canvas />;
}
