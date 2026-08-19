const Panel = (props: Record<string, unknown>) => <div>{String(props.class)}</div>;
const Field = (props: Record<string, unknown>) => <label>{String(props.for)}</label>;

// Solid's own spellings, which are the ones it forwards.
export function Form() {
  return (
    <>
      <Panel class="field" />
      <Field for="email" />
    </>
  );
}
