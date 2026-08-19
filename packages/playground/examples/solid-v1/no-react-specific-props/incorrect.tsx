const Panel = (props: Record<string, unknown>) => <div>{String(props.class)}</div>;
const Field = (props: Record<string, unknown>) => <label>{String(props.for)}</label>;

// On a *component* nothing renames these props on the way in, so a component
// written for Solid reads `props.class` and `props.for` and finds `undefined`.
// The mistake is silent at runtime, and no type reports it when the component
// accepts arbitrary keys.
export function Form() {
  return (
    <>
      <Panel className="field" />
      <Field htmlFor="email" />
    </>
  );
}
