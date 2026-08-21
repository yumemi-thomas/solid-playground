import { Portal } from 'solid-js';

// The bundled 1.x contract has no Portal export under this entry point. In a
// real external package the missing export summary is an uncertifiable gap.
export function Toast(props: { message: string }) {
  return <Portal>{props.message}</Portal>;
}
