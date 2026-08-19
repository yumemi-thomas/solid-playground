import { createSignal } from 'solid-js';

// An object lets Solid patch one declaration at a time, and the keys are real
// CSS property names — checked, and readable as such. A `--` custom property is
// CSS's own escape hatch and is never reported.
export function Badge() {
  const [width] = createSignal(120);
  return (
    <div>
      <div style={{ 'color': 'red', 'width': `${width()}px` }}>badge</div>
      <div style={{ '-webkit-align-content': 'center' }}>prefixed</div>
      <div style={{ '--accent': 'red' }}>custom</div>
    </div>
  );
}
