// SC8006 emits no finding, by design, and this file cannot make it speak.
//
// The rule exists to keep eslint-plugin-solid's identity resolvable: a migrating
// configuration that names `solid/jsx-uses-vars` translates to
// `solid-checker/v1/jsx-uses-vars` and resolves instead of failing on an unknown
// rule name. Documenting it here is what keeps the silence readable as a
// decision rather than a gap.
//
// Upstream's rule marks identifiers referenced by JSX as used, so a separate
// `no-unused-vars` pass does not mistake component tags for dead bindings.
// solid-checker builds on TypeScript reference facts, where a JSX tag and a JSX
// expression already point at their declarations — so there is no missing usage
// to repair, and unused-variable reporting stays with the project's own
// TypeScript or lint configuration.
//
// `Card` and `Show` below are referenced only from JSX. Both are ordinary
// TypeScript references, and nothing reports them as unused.
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
