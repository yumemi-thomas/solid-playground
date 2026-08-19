declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      autofocus: boolean;
    }
  }
}

// The directive resolves to a value declaration in scope, which is what the
// compiler needs to call at directive-application time.
const autofocus = (element: HTMLElement) => {
  element.focus();
};

export function Field() {
  return <input use:autofocus={true} />;
}

// Referencing the binding keeps it alive for bundlers that only see compiled
// output, where the `use:` attribute has become a call.
export const directives = { autofocus };
