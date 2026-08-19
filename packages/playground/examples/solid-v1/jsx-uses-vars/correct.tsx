// There is no "incorrect" counterpart to write: the rule reports nothing in
// either direction. This is the same file as the other tab, kept so the pair
// stays symmetrical — and so it is obvious that the silence is the rule's whole
// behaviour, not a missing example.
import { Show } from 'solid-js';

function Card() {
  return <article>card</article>;
}

export function Page() {
  return (
    <Show when={true}>
      <Card />
    </Show>
  );
}
