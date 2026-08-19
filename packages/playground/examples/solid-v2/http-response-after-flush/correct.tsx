import { Loading, createMemo } from 'solid-js';
import { httpHeader, httpStatus, renderToStream } from '@solidjs/web';

interface Product {
  available: boolean;
  name: string;
}

declare function fetchProduct(): Promise<Product>;

const product = createMemo(() => fetchProduct());

// Shell content: this component renders outside every boundary, so the head has
// not committed yet and both calls apply.
function NotFound() {
  httpStatus(404);
  httpHeader('cache-control', 'no-store');
  return <h1>Not found</h1>;
}

function ProductDetails() {
  return <article>{product().name}</article>;
}

export function Page() {
  return (
    <main>
      <NotFound />
      <Loading fallback={<span>Loading…</span>}>
        <ProductDetails />
      </Loading>
    </main>
  );
}

export function serve() {
  return renderToStream(() => <Page />);
}
