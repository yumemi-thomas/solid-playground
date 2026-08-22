import { createEffect, createSignal } from 'solid-js';

declare function show(): void;
declare function hide(): void;

// Create the computation in the component owner. The ref callback itself only
// performs DOM and listener work, so it creates nothing per element.
export function SaveButton() {
  const [hovered, setHovered] = createSignal(false);
  createEffect(
    () => hovered(),
    (on) => (on ? show() : hide()),
  );

  return (
    <button
      ref={(element) => {
        element.title = 'Save';
        element.addEventListener('mouseenter', () => setHovered(true));
        element.addEventListener('mouseleave', () => setHovered(false));
      }}
    >
      Save
    </button>
  );
}
