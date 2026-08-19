import { Portal } from 'solid-js';

// The bundled `solid-js` contract describes each export per *entry point*: which
// arguments it tracks, which callbacks it runs, whether it returns accessors. It
// has no summary for `Portal` under `solid-js`, because in Solid 1.x that name
// lives in `solid-js/web` — so the analysis has a hole where this element's
// reactive behaviour should be, and anything flowing through it is uncertifiable
// rather than certified or proven wrong.
//
// TypeScript reports the wrong entry point here as well. The rule earns its
// place on third-party packages whose contract exists but omits the export you
// imported — which needs a second package, so the playground cannot show it.
export function Toast(props: { message: string }) {
  return <Portal>{props.message}</Portal>;
}
