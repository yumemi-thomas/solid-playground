import { createStore } from 'solid-js/store';

// Solid's stores are built on native ES2015 `Proxy`, which cannot be faithfully
// polyfilled. For a project that must ship to a runtime without Proxy support,
// the runtime import from `solid-js/store` is the dependency that breaks it.
export function Profile() {
  const [profile, setProfile] = createStore({ name: 'Ada' });
  return <button onClick={() => setProfile('name', 'Grace')}>{profile.name}</button>;
}
