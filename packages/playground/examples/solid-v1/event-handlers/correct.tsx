// The canonical camelCase spellings. A mis-cased or non-standard name is a
// TypeScript error rather than this rule's business.
export function Toolbar() {
  return (
    <div>
      <button onClick={() => console.log('save')}>Save</button>
      <button onDblClick={() => console.log('open')}>Open</button>
    </div>
  );
}
