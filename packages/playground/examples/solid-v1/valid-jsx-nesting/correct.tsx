// Written so the parser keeps the tree: siblings are closed explicitly, block
// content lives outside the paragraph, and the table carries its `tbody`.
export function Sound() {
  return (
    <main>
      <ul>
        <li>first</li>
        <li>second</li>
      </ul>
      <p>summary</p>
      <div>details</div>
      <table>
        <tbody>
          <tr>
            <td>cell</td>
          </tr>
        </tbody>
      </table>
      {/* Nesting a list inside an `li` is fine: `ul` is a scope boundary, so the
          parser preserves it verbatim. */}
      <ul>
        <li>
          outer
          <ul>
            <li>inner</li>
          </ul>
        </li>
      </ul>
    </main>
  );
}
