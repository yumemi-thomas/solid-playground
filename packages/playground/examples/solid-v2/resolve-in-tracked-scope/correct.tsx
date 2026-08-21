import { createMemo, createSignal, resolve } from 'solid-js';

const [user, setUser] = createSignal('ada');

// Read reactively in the memo; keep resolve in the imperative click boundary.
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
