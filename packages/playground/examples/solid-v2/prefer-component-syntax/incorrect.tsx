// `renderHeader` returns JSX, so it is a component in everything but spelling.
// Calling it as an expression hides the component boundary from the compiler,
// from dev tools, and from the reader.
const renderHeader = () => <header>Reports</header>;

export const Panel = () => <article>{renderHeader()}</article>;
