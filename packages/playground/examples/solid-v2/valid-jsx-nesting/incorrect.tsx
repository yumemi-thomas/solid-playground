// The HTML parser rewrites every one of these trees, so the DOM the browser
// builds is not the DOM this file describes — and server-rendered markup then
// hydrates against a different shape.
export function Broken() {
  return (
    <main>
      {/* `li` implicitly closes the open `li`: no list boundary between them. */}
      <ul>
        <li>
          first
          <li>second</li>
        </li>
      </ul>
      {/* A `div` closes the open `p`. */}
      <p>
        <div>details</div>
      </p>
      {/* The parser inserts a `tbody` around the row. */}
      <table>
        <tr>
          <td>cell</td>
        </tr>
      </table>
    </main>
  );
}
