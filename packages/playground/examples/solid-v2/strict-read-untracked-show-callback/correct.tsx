import { For, createSignal } from 'solid-js';

const [name] = createSignal('Ada');

export function Profile() {
  return <For each={[true]}>{() => <h1>{name()}</h1>}</For>;
}
