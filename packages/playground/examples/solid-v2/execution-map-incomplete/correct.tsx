// The first fix for an unclassified expression: hoist the logic into a memo and
// interpolate the accessor. A plain accessor interpolation is the simplest JSX
// position there is, and it always classifies.
import { createMemo, createSignal } from 'solid-js';

declare function buildLabel(user: string, locale: string): string;

const [user] = createSignal('ada');
const [locale] = createSignal('en');

const label = createMemo(() => buildLabel(user(), locale()));

export function Greeting() {
  return <span>{label()}</span>;
}
