import { createMemo, onSettled } from 'solid-js';

// onSettled is a leaf owner: it cannot attach a child computation that needs
// ownership and disposal.
export function Widget() {
  onSettled(() => {
    const label = createMemo(() => 'ticking');
    console.log(label());
  });
  return <div>ticking</div>;
}
