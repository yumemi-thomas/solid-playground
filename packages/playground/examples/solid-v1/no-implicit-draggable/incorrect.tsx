// `draggable` is an HTML *enumerated* attribute, not a boolean one: its valid
// values are the strings "true" and "false". The JSX boolean shorthand serializes
// an empty value, which selects the invalid-value default `auto`.
export function Gallery() {
  return (
    <figure>
      <img src="/chart.png" draggable />
    </figure>
  );
}
