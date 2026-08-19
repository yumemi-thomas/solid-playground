// A string-valued `style` is replaced wholesale on every update, so Solid cannot
// patch individual declarations. A vendor-prefixed key is the other arm no type
// reports: `CSSProperties` carries a `-${string}` index signature, so TypeScript
// accepts whatever is spelled after the dash.
export function Badge() {
  return (
    <div>
      <div style="color: red; width: 120px">badge</div>
      <div style={{ '-fooBar': '1px' }}>prefixed</div>
    </div>
  );
}
