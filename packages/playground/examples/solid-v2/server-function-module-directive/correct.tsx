import { GET } from '@solidjs/web/server-functions';

interface User {
  id: string;
}

// No module-level directive. A function-level `"use server"` round-trips the
// wrapper call in both builds, so the export survives on the client.
export const getUser = GET(async (id: string): Promise<User> => {
  'use server';
  return { id };
});
