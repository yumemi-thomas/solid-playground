const canDrag = () => true;

// A static string when the state never changes, an expression when it does.
// Solid 1.x stringifies attribute values, so a boolean expression renders
// "true"/"false" and behaves — but the explicit string spelling is the one that
// also survives a migration to Solid 2.0.
export function Gallery() {
  return (
    <figure>
      <img src="/chart.png" draggable="true" />
      <img src="/thumb.png" draggable={canDrag() ? 'true' : 'false'} />
    </figure>
  );
}
