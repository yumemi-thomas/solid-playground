import { Portal } from 'solid-js/web';

// Imported from the entry point that actually exports it, `Portal` resolves to
// its contract summary and the analysis can follow the subtree it renders.
export function Toast(props: { message: string }) {
  return <Portal>{props.message}</Portal>;
}
