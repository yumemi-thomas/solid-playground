// Component syntax makes the boundary explicit and keeps Solid 1.x's component
// conventions intact.
const Header = () => <header>Reports</header>;

export const Panel = () => (
  <article>
    <Header />
  </article>
);
