import { Show, createSignal } from 'solid-js';

const [name] = createSignal('Ada');
const [section] = createSignal<string | null>('profile');

export function Profile() {
  return (
    <Show when={section()}>
      {(_section) => {
        // This callback body is a rendering function, but this local read is
        // outside JSX and therefore is evaluated once without tracking.
        const label = name();
        return <h1>{label}</h1>;
      }}
    </Show>
  );
}
