import { createResource, createSignal } from 'solid-js';

const [id] = createSignal('ada');

declare function fetchUser(userId: string): Promise<{ name: string }>;

// `createResource` is a Solid 1.x API that 2.0 removed, so there is no export
// left for the bundled contract to describe. Everything flowing through the call
// becomes uncertifiable, and the finding's hint points at the 2.0 replacement
// rather than asking for a contract entry.
//
// TypeScript reports the missing export here too. The rule earns its place on
// packages whose contract exists but has no entry for the export you imported —
// which needs a second package, so the playground cannot show that shape.
const [user] = createResource(id, fetchUser);

export function Profile() {
  return <h1>{user()?.name}</h1>;
}
