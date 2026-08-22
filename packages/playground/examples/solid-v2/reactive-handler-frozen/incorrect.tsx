const invalidHandler = 12;

// TypeScript does not inspect hyphenated JSX attributes, but Solid still treats
// a native `on-*` name as an event listener. The number will fail at runtime.
export function App() {
  return <button on-save={invalidHandler}>Save</button>;
}
