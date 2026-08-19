// Component syntax makes the boundary explicit and keeps Solid's conventions
// around props, ownership, and one-time setup.
const Header = () => <header>Reports</header>;

export const Panel = () => (
  <article>
    <Header />
  </article>
);
