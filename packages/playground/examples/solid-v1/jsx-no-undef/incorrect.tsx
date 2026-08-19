// The directive name is declared, so TypeScript accepts the attribute — but
// TypeScript does not bind the *local name* node of a namespaced JSX attribute,
// so nothing else reports that no `autofocus` value exists in this module.
declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      autofocus: boolean;
    }
  }
}

export function Field() {
  return <input use:autofocus={true} />;
}
