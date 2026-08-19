// `draggable` is an enumerated attribute, not a boolean one. Solid 2.0
// serializes a literal `false` by removing the attribute, and removal selects
// the `auto` state — which, on an image and on a linked anchor, means
// draggable. Both of these re-enable exactly what they were written to stop.
export function Gallery() {
  return (
    <figure>
      <img src="/chart.png" draggable={false} />
      <a href="/chart.png" draggable={false}>
        Download
      </a>
    </figure>
  );
}
