interface Audit {
  when: Date;
  labels: string[];
}

// The rich value is not visible at the call site: it is hidden in a named
// interface. Type facts still reach through the alias and inspect the payload.
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
