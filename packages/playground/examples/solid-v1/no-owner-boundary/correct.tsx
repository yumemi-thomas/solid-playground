import { Suspense } from 'solid-js';

// The boundary lives inside a component, so the surrounding owner adopts it and
// disposes the whole subtree with the rest of the tree.
function Profile() {
  return (
    <Suspense fallback={<span>Loading…</span>}>
      <p>Profile</p>
    </Suspense>
  );
}

export function App() {
  return <Profile />;
}
