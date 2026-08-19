import { createEffect, createSignal } from 'solid-js';

declare function show(): void;
declare function hide(): void;

const [visible, setVisible] = createSignal(false);

// The returned callback is the apply phase: it runs once per element, unowned.
// A computation created there is never disposed, so every element leaks one.
function tooltip() {
  return (element: HTMLElement) => {
    element.title = 'Save';
    createEffect(
      () => visible(),
      (on) => (on ? show() : hide()),
    );
  };
}

export function SaveButton() {
  return (
    <button ref={tooltip()} onClick={() => setVisible(true)}>
      Save
    </button>
  );
}
