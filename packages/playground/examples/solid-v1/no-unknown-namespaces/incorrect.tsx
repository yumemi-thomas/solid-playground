const Panel = (props: Record<string, unknown>) => <div>{String(props['on:click'])}</div>;

// The compiler special-cases namespaces only on the DOM elements it lowers
// directly. On a *component* the props are a plain object, so `on:click` arrives
// as an inert `"on:click"` key and no listener is ever attached — and because the
// component accepts arbitrary keys, no type objects either.
//
// `class:` on an intrinsic element is the other surviving arm: TypeScript does
// not type-check a JSX attribute name containing a hyphen at all.
export function Toolbar() {
  return (
    <div>
      <Panel on:click={() => console.log('save')} />
      <div class:is-active={true} />
    </div>
  );
}
