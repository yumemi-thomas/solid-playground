// This finding needs a real package boundary, which one playground file cannot
// create. It reports a reactive source passed to an imported helper whose
// package contract does not say when or where the source will be read:
//
//     import { track } from "some-widgets";
//     track(count); // immediate, tracked, or stored for later? -> SC9011
//
// Keep your own helper in the project (see the fixed version), or ship a
// reviewed solid-reactivity.json with the package.
import { createSignal } from 'solid-js';

const [count] = createSignal(0);

export function Counter() {
  return <span>{count()}</span>;
}
