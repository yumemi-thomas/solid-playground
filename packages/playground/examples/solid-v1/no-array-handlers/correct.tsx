interface Record {
  id: string;
}

declare function save(data: Record, event: MouseEvent): void;

const record: Record = { id: 'a' };

// A plain function whose parameters and captured data TypeScript can check
// end to end.
export function SaveButton() {
  return <button onClick={(event) => save(record, event)}>Save</button>;
}
