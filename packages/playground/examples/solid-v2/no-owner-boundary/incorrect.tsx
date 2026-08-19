import { Loading } from 'solid-js';

// Built at module scope, this boundary has no owner: neither it nor anything
// rendered beneath it can ever be disposed.
export const widget = (
  <Loading fallback={<span>Loading…</span>}>
    <p>Profile</p>
  </Loading>
);
