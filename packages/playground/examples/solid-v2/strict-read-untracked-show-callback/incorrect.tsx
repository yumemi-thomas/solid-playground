import { For, createSignal } from 'solid-js';

const [name] = createSignal('Ada');

export function Profile() {
  return (
    <For each={[true]}>
      {() => {
        // This callback body is a rendering function, but this local read is
        // outside JSX and therefore is evaluated once without tracking.
        const label = name();
        return <h1>{label}</h1>;
      }}
    </For>
  );
}
