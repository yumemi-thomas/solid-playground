interface Record {
  id: string;
}

declare function save(data: Record, event: MouseEvent): void;

const record: Record = { id: 'a' };

// Solid types an event prop as `EHandler | BoundEventHandler`, and
// `BoundEventHandler`'s first member takes `data: any`. So the data the handler
// receives is never checked against the data the tuple carries: the pair
// type-checks and then fails when the event is dispatched.
//
// The alias is the point — `SaveHandler` reveals nothing about the tuple.
type SaveHandler = [(data: Record, event: MouseEvent) => void, Record];
const click: SaveHandler = [save, record];

export function SaveButton() {
  return <button onClick={click}>Save</button>;
}
