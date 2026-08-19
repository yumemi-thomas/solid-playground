// SC9006 reports a callback that reaches an external helper whose runtime
// execution timing no contract describes. The checker refuses to guess between
// inline, tracked, and deferred execution, because each answer implies a
// different set of reactive obligations for the callback body — whether its
// reads track, whether its writes are legal, whether its cleanup registers.
//
// A single playground file cannot reproduce it: the undescribed helper has to
// come from outside the analysed project, so the defect looks like this pair of
// modules rather than one file:
//
//     import { onIdle } from "some-scheduler";
//     onIdle(() => setStatus(count()));   // when does this body run? -> SC9006
//
// The finding itself carries what a fix needs: the package entrypoint, the
// function, the callback parameter type, the execution choice it needs, and an
// editable JSON stub. Audit the helper, replace the placeholders, and install
// the reviewed contract at the package's `solid-reactivity.json`.
//
// The other fix is to stop crossing the boundary at all — see correct.tsx.
import { createSignal } from 'solid-js';

const [attempts] = createSignal(0);

export function AttemptCount() {
  return <span>{attempts()}</span>;
}
