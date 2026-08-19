import { createSignal } from 'solid-js';

// Plain signals and eager objects need no Proxy, so the same state works on a
// constrained target.
export function Profile() {
  const [profile, setProfile] = createSignal({ name: 'Ada' });
  return <button onClick={() => setProfile({ name: 'Grace' })}>{profile().name}</button>;
}
