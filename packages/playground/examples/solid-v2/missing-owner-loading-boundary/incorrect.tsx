import { Loading } from 'solid-js';

// A boundary created at module scope has no owner to dispose its subtree.
export const orphaned = (
  <Loading fallback={<p>Loading…</p>}>
    <p>Profile</p>
  </Loading>
);
