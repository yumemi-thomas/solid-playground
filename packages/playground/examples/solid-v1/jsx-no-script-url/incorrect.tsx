// A `javascript:` URL mixes navigation with code execution, and it is a classic
// injection sink. Matching follows browser URL normalisation, so encoding the
// colon or padding the scheme with control characters does not disarm it.
export function Actions() {
  return (
    <div>
      <a href="javascript:void(0)">Dismiss</a>
      <a href="java&#9;script:alert(1)">Tricky</a>
    </div>
  );
}
