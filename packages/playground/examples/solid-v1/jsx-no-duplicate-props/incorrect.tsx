// Two *differently spelled* props that the Solid 1.x compiler folds into one
// slot. Nothing relates them at the type level, so TypeScript sees two distinct,
// legal properties and says nothing — while one of the two writes is dead.
export function Card() {
  return (
    <div>
      {/* `onClick` and `onclick` both lower to the delegated `el.$$click`
          property write, so the later one silently overwrites the first and
          only `audit` ever runs. (The lowercase spelling is separately
          reported by `v1/event-handlers`.) */}
      <button onClick={() => console.log('save')} onclick={() => console.log('audit')} />
      {/* A spread followed by an attribute. The later attribute legitimately
          wins, which is the one identical-name order TypeScript leaves alone —
          so the spread's `id` is dead and nothing else says so. */}
      <div {...{ id: 'spread' }} id="attribute" />
    </div>
  );
}
