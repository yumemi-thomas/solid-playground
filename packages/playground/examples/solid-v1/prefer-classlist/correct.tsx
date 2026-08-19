import { createSignal } from 'solid-js';

// `classList` hands Solid the conditions directly, so each class is toggled on
// its own rather than through a rebuilt string.
export function Row() {
  const [selected] = createSignal(false);
  return (
    <div class="row" classList={{ selected: selected() }}>
      row
    </div>
  );
}
