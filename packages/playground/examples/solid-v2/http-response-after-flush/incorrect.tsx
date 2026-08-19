import { Loading, createMemo } from 'solid-js';
import { httpHeader, httpStatus, renderToStream } from '@solidjs/web';

interface Product {
  available: boolean;
  name: string;
}

declare function fetchProduct(): Promise<Product>;

const product = createMemo(() => fetchProduct());

// `ProductDetails` renders below a `<Loading>` boundary. If the fetch is slow the
// shell flushes first, the response head commits with it, and both of these
// calls become silent no-ops.
function ProductDetails() {
  httpStatus(410);
  httpHeader('cache-control', 'no-store');
  return <article>{product().name}</article>;
}

export function Page() {
  return (
    <main>
      <Loading fallback={<span>Loading…</span>}>
        <ProductDetails />
      </Loading>
    </main>
  );
}

export function serve() {
  return renderToStream(() => <Page />);
}
