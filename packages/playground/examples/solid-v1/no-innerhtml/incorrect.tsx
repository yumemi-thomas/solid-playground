// A dynamic `innerHTML` is an injection surface: whatever reaches this prop is
// parsed as markup and executed as part of the document.
export function Article(props: { html: string }) {
  return <div innerHTML={props.html} />;
}
