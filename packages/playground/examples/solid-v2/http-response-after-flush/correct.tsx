import { Loading, createMemo } from 'solid-js';
import { httpHeader, httpStatus, renderToStream } from '@solidjs/web';

interface Product {
  available: boolean;
  name: string;
}

declare function fetchProduct(): Promise<Product>;

const product = createMemo(() => fetchProduct());

function ArchivedProduct() {
  return <article>{product().name}</article>;
}

export function Page() {
  // The archived status is known before loading product details, so declare it
  // in shell content where it is guaranteed to reach the response.
  httpStatus(410);
  httpHeader('cache-control', 'no-store');
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
