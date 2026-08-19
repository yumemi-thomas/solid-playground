// Inserting the value as a child inserts it as text, which is what a caller-
// supplied string almost always should be.
export function Article(props: { html: string }) {
  return <div>{props.html}</div>;
}
