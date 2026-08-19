'use server';
import { GET } from '@solidjs/web/server-functions';

interface User {
  id: string;
}

// Under a module-level directive only *direct* function exports become client
// references. A wrapped export is not one, so the client build drops it and the
// call site resolves to nothing.
export const getUser = GET(async (id: string): Promise<User> => {
  return { id };
});
