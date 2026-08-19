// One writer per slot. Where two props really are wanted on the same concern,
// they go through mechanisms the compiler keeps distinct — `classList` for
// independent conditional classes, rather than a second `class`.
export function Card(props: { active: boolean }) {
  return (
    <div>
      <button onClick={() => console.log('audit')} />
      <div id="attribute" />
      <div class="base" classList={{ active: props.active }} />
    </div>
  );
}
