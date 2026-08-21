declare const markup: string;

// JSX children and innerHTML both write the element's one content slot. The
// visible result depends on which write wins at runtime.
export function Card() {
  return <div innerHTML={markup}><span>Fallback</span></div>;
}
