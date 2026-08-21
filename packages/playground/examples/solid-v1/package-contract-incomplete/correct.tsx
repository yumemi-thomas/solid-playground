import { Portal } from 'solid-js/web';

// Portal is imported from the entry point whose contract describes it.
export function Toast(props: { message: string }) {
  return <Portal>{props.message}</Portal>;
}
