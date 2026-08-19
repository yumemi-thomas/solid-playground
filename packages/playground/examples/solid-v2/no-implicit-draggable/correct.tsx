const canDrag = () => false;

// The string spellings are the only ones that select a real state, and they
// survive both render paths unchanged.
export function Gallery() {
  return (
    <figure>
      <img src="/chart.png" draggable="false" />
      <a href="/chart.png" draggable="false">
        Download
      </a>
      <img src="/thumb.png" draggable={canDrag() ? 'true' : 'false'} />
    </figure>
  );
}
