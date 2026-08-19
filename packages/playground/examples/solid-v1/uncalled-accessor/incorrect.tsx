import { createSignal } from 'solid-js';

// `count` is the accessor function, not the number it holds. A template
// interpolation stringifies the function's own source, and a numeric coercion
// turns it into NaN — neither reads the signal.
export function Counter() {
  const [count] = createSignal(0);
  return (
    <div>
      <span>{`count is ${count}`}</span>
      <span>{-count}</span>
    </div>
  );
}
