'use server';

import { GET } from '@solidjs/web/server-functions';

function withAudit<T>(fn: T): T {
  return fn;
}

// The module directive cannot turn a generic wrapper into a direct client
// reference, so this export disappears from the client build.
export const getUser = withAudit(GET(async (id: string) => ({ id })));
