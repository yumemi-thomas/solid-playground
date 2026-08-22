import { Loading, createMemo } from 'solid-js';
import { httpHeader, httpStatus, renderToStream } from '@solidjs/web';

interface Product {
  available: boolean;
  name: string;
}

declare function fetchProduct(): Promise<Product>;

const product = createMemo(() => fetchProduct());

// This archived-product component renders below Loading. If the fetch is slow,
// the shell commits first and both response declarations become silent no-ops.
function ArchivedProduct() {
  httpStatus(410);
  httpHeader('cache-control', 'no-store');
  return <article>{product().name}</article>;
}

export function Page() {
  return (
    <main>
      <Loading fallback={<span>Loading…</span>}>
        <ArchivedProduct />
      </Loading>
    </main>
  );
}

export function serve() {
  return renderToStream(() => <Page />);
}
