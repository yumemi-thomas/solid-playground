const Spacer = () => <hr />;

// These elements have no children — whitespace across several lines is not a
// child — so the closing tags carry no information.
export function Layout() {
  return (
    <div>
      <span class="spacer"></span>
      <Spacer></Spacer>
    </div>
  );
}
