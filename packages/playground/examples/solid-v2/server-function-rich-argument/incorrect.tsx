// The default client transport sends a server function's arguments as plain
// JSON. A `Date` and a `Set` have no JSON form, so both throw at the transport
// before the request is even sent.
export async function saveEvent(when: Date, tags: Set<string>) {
  'use server';
  return { when, tags };
}

export function SaveButton() {
  return (
    <button
      onClick={async () => {
        await saveEvent(new Date(), new Set(['launch']));
      }}
    >
      Save
    </button>
  );
}
