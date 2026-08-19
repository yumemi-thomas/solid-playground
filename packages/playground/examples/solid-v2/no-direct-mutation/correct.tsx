import { createStore } from 'solid-js';

// The setter's draft callback is where mutation commits. Inside it the store's
// own proxy is write-enabled, and every subscriber is notified.
export function Toggle() {
  const [profile, setProfile] = createStore({ user: { name: 'Ada' } });

  return (
    <button
      onClick={() =>
        setProfile((draft) => {
          draft.user.name = 'Grace';
        })
      }
    >
      {profile.user.name}
    </button>
  );
}
