import { createEffect, createSignal } from 'solid-js';

// The primitive and the computation are created where an owner exists — the
// component body — and the `ref` callback keeps to DOM reads, writes, and
// listener wiring. Nothing is created per element, so nothing leaks per element.
function Row() {
  const [seen, setSeen] = createSignal(false);
  createEffect(() => console.log(seen()));

  return (
    <div
      ref={(element) => {
        element.addEventListener('click', () => setSeen(true));
      }}
    >
      row
    </div>
  );
}

export function App() {
  return <Row />;
}
