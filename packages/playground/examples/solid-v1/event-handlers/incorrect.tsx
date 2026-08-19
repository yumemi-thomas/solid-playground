// Solid 1.x declares every standard handler under both its camelCase and its
// all-lowercase spelling, so these type-check and attach correctly. The
// objection is readability: the canonical spelling is the camelCase one, and a
// lowercase `on*` name reads like an HTML attribute rather than a listener.
export function Toolbar() {
  return (
    <div>
      <button onclick={() => console.log('save')}>Save</button>
      <button ondblclick={() => console.log('open')}>Open</button>
    </div>
  );
}
