import { enableRichArguments } from '@solidjs/web/server-functions/rich-args';

interface Audit {
  when: Date;
  labels: string[];
}

// The project-wide rich-argument codec makes nested Date values transportable;
// the checker can then certify the same interface unchanged at every call site.
enableRichArguments();

export async function saveAudit(audit: Audit) {
  'use server';
  return audit;
}

export function SaveButton() {
  return (
    <button onClick={() => saveAudit({ when: new Date(), labels: ['launch'] })}>
      Save
    </button>
  );
}
