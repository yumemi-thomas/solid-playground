import { createStore } from 'solid-js';

export function App() {
  const [profile, setProfile] = createStore({ tags: ['solid'] });
  return (
    <button
      onClick={() =>
        setProfile((draft) => {
          draft.tags.push('checker');
        })
      }
    >
      {profile.tags.join(', ')}
    </button>
  );
}
