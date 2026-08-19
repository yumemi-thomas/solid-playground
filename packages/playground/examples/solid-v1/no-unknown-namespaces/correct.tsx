const Panel = (props: { onClick: () => void }) => <button onClick={() => props.onClick()}>Save</button>;

// A component takes an ordinary prop and decides for itself what to do with it.
// The intrinsic element uses `classList`, which the compiler does lower.
export function Toolbar(props: { active: boolean }) {
  return (
    <div>
      <Panel onClick={() => console.log('save')} />
      <div classList={{ 'is-active': props.active }} />
    </div>
  );
}
