import { createSignal } from 'solid-js';

// The signal holds a reference to this object. Mutating the object in place
// changes what readers see without ever notifying them, so nothing re-renders.
export function Profile() {
  const [user] = createSignal({ name: 'Ada' });

  const rename = () => {
    user().name = 'Grace';
  };

  return <button onClick={rename}>{user().name}</button>;
}
