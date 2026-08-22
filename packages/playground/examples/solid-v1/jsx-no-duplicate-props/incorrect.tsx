// These differently spelled props both lower to the same delegated click slot.
// TypeScript sees two legal names, but only the later handler survives.
export function Card() {
  return <button onClick={() => console.log('save')} onclick={() => console.log('audit')} />;
}
