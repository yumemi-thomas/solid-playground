import { createSignal } from 'solid-js';

// A `ref` callback runs in the compiler's directive-application phase: once per
// element, outside the component's normal owner lifetime. A primitive created
// there is attached to nothing, so it is never disposed.
function Row() {
  return (
    <div
      ref={(element) => {
        const [seen, setSeen] = createSignal(false);
        element.addEventListener('click', () => setSeen(true));
        element.title = String(seen());
      }}
    >
      row
    </div>
  );
}

export function App() {
  return <Row />;
}
