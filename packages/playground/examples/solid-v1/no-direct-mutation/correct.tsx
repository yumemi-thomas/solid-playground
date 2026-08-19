import { createSignal } from 'solid-js';

// The setter is what notifies subscribers, so the new value has to go through
// it. A fresh object also keeps the change detectable by reference.
export function Profile() {
  const [user, setUser] = createSignal({ name: 'Ada' });

  return <button onClick={() => setUser({ ...user(), name: 'Grace' })}>{user().name}</button>;
}
