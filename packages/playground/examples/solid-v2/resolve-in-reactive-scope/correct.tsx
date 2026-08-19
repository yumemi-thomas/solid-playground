import { createMemo, createSignal, resolve } from 'solid-js';

const [user, setUser] = createSignal('ada');

// A tracked scope reads the accessor directly — that is what tracked reads are
// for. `resolve()` stays in imperative code, where no observer is active.
export function Label() {
  const label = createMemo(() => user());
  return (
    <button
      onClick={async () => {
        const current = await resolve(() => user());
        setUser(current.toUpperCase());
      }}
    >
      {label()}
    </button>
  );
}
