// SC9004 reports a JSX expression the Solid compiler left unclassified: neither
// tracked, nor untracked, nor a callback. Every read rule is anchored on that
// classification, so a gap in it makes the reads inside the expression
// impossible to judge either way.
//
// This file cannot reproduce the finding, and that is the rule working as
// designed: the compiler that ships with solid-checker classifies every JSX site
// it supports, so a fresh project analysed with it never reaches SC9004. The
// rule stays fail-closed for a custom, stale, or future fact producer — a
// classification gap is treated as "cannot judge", never as "nothing to judge".
//
// What a real SC9004 looks like is an ordinary-seeming interpolation the producer
// did not classify:
//
//     return <span>{buildLabel(user(), locale())}</span>;
//
// and the two things to try, in order, are: simplify the expression (see
// correct.tsx), then re-run the analysis cold to refresh stale compiler facts.
// If it survives both, the JSX pattern and compiler options belong in a
// solid-checker issue — it points at a producer defect.
import { createSignal } from 'solid-js';

declare function buildLabel(user: string, locale: string): string;

const [user] = createSignal('ada');
const [locale] = createSignal('en');

export function Greeting() {
  return <span>{buildLabel(user(), locale())}</span>;
}
