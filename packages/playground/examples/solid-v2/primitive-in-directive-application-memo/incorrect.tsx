import { createMemo, createSignal } from 'solid-js';

const [visible, setVisible] = createSignal(false);

function tooltip() {
  return (element: HTMLElement) => {
    // A memo created in the ref apply callback leaks for every element.
    const label = createMemo(() => (visible() ? 'visible' : 'hidden'));
    element.title = label();
  };
}

export function App() {
  return <button ref={tooltip()} onClick={() => setVisible(true)}>Save</button>;
}
