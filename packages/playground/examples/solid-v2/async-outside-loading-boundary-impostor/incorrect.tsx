import { createMemo, createSignal, type ParentComponent } from 'solid-js';

interface User {
  name: string;
}

const [id] = createSignal('ada');

declare function fetchUser(userId: string): Promise<User>;

const user = createMemo(() => fetchUser(id()));

// The name is convincing, but this is an ordinary component. It only renders
// a section; it does not install Solid's async Loading boundary.
const Loading: ParentComponent = (props) => <section data-state="loading">{props.children}</section>;

export function Profile() {
  return (
    <Loading>
      <h1>{user().name}</h1>
    </Loading>
  );
}
