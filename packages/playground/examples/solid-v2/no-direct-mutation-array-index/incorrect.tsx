import { createStore } from 'solid-js';

export function App() {
  const [profile] = createStore({ tags: ['solid'] });
  const addTag = () => {
    // The index is dynamic, but the target is still the readonly store proxy.
    profile.tags[profile.tags.length] = 'checker';
  };
  return <button onClick={addTag}>{profile.tags.join(', ')}</button>;
}
