import { createStore } from 'solid-js';

// A store is a readonly proxy. Writing through it outside its own setter is
// dropped by the runtime, so the click appears to do nothing — and the
// readonly-ness is shallow, so TypeScript does not object to a nested write.
export function Toggle() {
  const [profile] = createStore({ user: { name: 'Ada' } });

  const rename = () => {
    profile.user.name = 'Grace';
  };

  return <button onClick={rename}>{profile.user.name}</button>;
}
