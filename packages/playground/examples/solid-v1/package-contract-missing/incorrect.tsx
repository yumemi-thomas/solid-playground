// SC9005 reports an imported package whose own manifest depends on `solid-js` or
// `@solidjs/*` and for which no usable reactivity contract could be found. The
// message says which of three cases applies: **missing** (no contract at any
// tier), **stale** (the contract describes a different version of the package
// than the one installed), or **unverified** (the contract's claims were
// generated and never reviewed).
//
// A single playground file cannot reproduce it: the finding is about a *second*
// package, and everything this file can import is Solid itself, whose contracts
// solid-checker bundles and version-pins. So the shape of the defect is a
// dependency, not a line of code:
//
//     import { createDraggable } from "solid-dnd";   // no contract -> SC9005
//
// In a real project the fix is to install a reviewed contract:
//
//     solid-checker contract check
//     solid-checker contract generate --package-root node_modules/solid-dnd \
//       --output .solid-checker/contracts/solid-dnd/solid-reactivity.json
//
// Worth knowing: the bundled contracts are pinned to exact audited releases, so
// upgrading `solid-js` to an unaudited version makes Solid itself the package
// with no usable contract — SC9005 then names both versions, and the fix is to
// pin back, upgrade solid-checker, or supply a reviewed local override.
//
// General-purpose packages that do not depend on Solid are exempt: they cannot
// participate in reactivity, so they need no contract.
import { createMemo, createSignal } from 'solid-js';

const [count] = createSignal(0);

export const doubled = createMemo(() => count() * 2);
