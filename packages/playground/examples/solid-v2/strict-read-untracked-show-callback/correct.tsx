import { Show, createSignal } from 'solid-js';

const [name] = createSignal('Ada');
const [section] = createSignal<string | null>('profile');

export function Profile() {
  return <Show when={section()}>{(_section) => <h1>{name()}</h1>}</Show>;
}
