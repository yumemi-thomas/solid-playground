interface Payload {
  matcher: RegExp;
}

export async function save(payload: Payload) {
  'use server';
  return payload;
}

export function App() {
  return <button onClick={() => save({ matcher: /solid/ })}>Save</button>;
}
