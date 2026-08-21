import { createResource, createSignal } from 'solid-js';

const [id] = createSignal('ada');

declare function fetchUser(userId: string): Promise<{ name: string }>;

// createResource is a removed 1.x export, so the exact bundled package
// contract has no entry for it. TypeScript also catches the bad import in this
// compact single-file demonstration.
const [user] = createResource(id, fetchUser);

export function Profile() {
  return <h1>{user()?.name}</h1>;
}
