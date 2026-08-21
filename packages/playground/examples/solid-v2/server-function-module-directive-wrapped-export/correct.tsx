import { GET } from '@solidjs/web/server-functions';

function withAudit<T>(fn: T): T {
  return fn;
}

export const getUser = withAudit(
  GET(async (id: string) => {
    'use server';
    return { id };
  }),
);
