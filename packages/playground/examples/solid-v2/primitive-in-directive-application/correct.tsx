import { createEffect, createSignal } from 'solid-js';

declare function show(): void;
declare function hide(): void;

// The computation is created where an owner exists — the component body — and
// the `ref` callback keeps to DOM reads, writes, and listener wiring. Nothing is
// created per element, so nothing leaks per element.
export function SaveButton() {
  const [hovered, setHovered] = createSignal(false);
  createEffect(
    () => hovered(),
    (on) => (on ? show() : hide()),
  );

  return (
    <button
      ref={(element) => {
        element.addEventListener('mouseenter', () => setHovered(true));
        element.addEventListener('mouseleave', () => setHovered(false));
      }}
    >
      Save
    </button>
  );
}
