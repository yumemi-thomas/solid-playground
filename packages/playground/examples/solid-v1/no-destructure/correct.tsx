import { createSignal } from 'solid-js';

const [title, setTitle] = createSignal('Draft');

// The props object stays intact and each member is read where it is used. To
// split props use `splitProps(props, [...keys])`, and to default them use
// `mergeProps(defaults, props)` — both hand back prop proxies, so binding their
// result is safe. It is the property *access* that has to stay deferred.
function Card(props: { label: string }) {
  return <h2>{props.label}</h2>;
}

export function App() {
  return (
    <>
      <Card label={title()} />
      <button onClick={() => setTitle('Published')}>Publish</button>
    </>
  );
}
