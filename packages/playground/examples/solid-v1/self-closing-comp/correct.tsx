const Spacer = () => <hr />;

// Self-closing syntax says "no children" in one place.
export function Layout() {
  return (
    <div>
      <span class="spacer" />
      <Spacer />
    </div>
  );
}
