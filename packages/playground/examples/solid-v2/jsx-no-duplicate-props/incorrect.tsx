// JSX children and textContent both write the element's one content slot. The
// visible result depends on which write wins at runtime.
export function Card() {
  return <div textContent="Saved">Saving…</div>;
}
