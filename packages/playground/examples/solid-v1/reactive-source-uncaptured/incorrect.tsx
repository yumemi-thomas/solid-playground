// SC9011 reports a reactive source — an accessor, a store, a derived function —
// passed to a *package-imported* function whose reactive behaviour nothing
// describes. The value may be read immediately (severing reactivity), called
// inside a tracking scope (correct), or stored for later. The analysis can prove
// none of the three, so every read that flows through the call becomes
// uncertifiable rather than certified or proven wrong.
//
// A single playground file cannot reproduce it: only *package* callees are
// reported, because a contract is the fix and only a package can carry one. An
// ambient global (`setTimeout`, `console.log`, an array method) comes from no
// package, so reads flowing through one stay uncertified without a finding
// demanding a fix nobody could write. Everything this file can import is Solid
// itself, whose contract is bundled.
//
// The shape of the defect is therefore a package boundary:
//
//     import { track } from "some-widgets";
//     track(count);   // is `count` read reactively? returned? stored? -> SC9011
//
// Two fixes: keep the receiving function in the project so its body is analysed
// directly (see correct.tsx), or describe the export in the package's
// `solid-reactivity.json` — which arguments it tracks and what it returns.
//
// Note the severity is advisory but the *kind* is not: like every uncertifiable
// finding, SC9011 fails `--certify` until the boundary is described.
import { createSignal } from 'solid-js';

const [count] = createSignal(0);

export function Counter() {
  return <span>{count()}</span>;
}
