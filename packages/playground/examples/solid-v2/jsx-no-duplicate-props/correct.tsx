declare const markup: string;

// Choose one content mechanism for each intrinsic element.
export function Card() {
  return <div innerHTML={markup} />;
}
