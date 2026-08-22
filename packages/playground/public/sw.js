const cacheName = 'my-cache';
let cacheGeneration = 0;

async function notifyClient(event) {
  const client = event.clientId ? await clients.get(event.clientId) : null;
  if (client) {
    client.postMessage({ type: 'cache' });
    return;
  }
  const all = await clients.matchAll();
  for (const c of all) c.postMessage({ type: 'cache' });
}

function responsesDiffer(cached, fresh) {
  const cachedTag = cached.headers.get('etag') || cached.headers.get('last-modified');
  const freshTag = fresh.headers.get('etag') || fresh.headers.get('last-modified');
  if (cachedTag && freshTag) return cachedTag !== freshTag;
  return false;
}

async function fetchAndCache(cache, event) {
  try {
    const response = await fetch(event.request);
    if (response.ok) {
      await cache.put(event.request, response.clone());
    }
    return response;
  } catch (e) {
    console.error(e);
    if (event.request.mode === 'navigate') {
      return await cache.match('/index.html');
    }
    throw e;
  }
}

async function invalidateCache(event, generation) {
  // Several cached requests can discover the same deployment at once. Only the
  // first one should clear the old generation and notify the page.
  if (generation !== cacheGeneration) return;
  cacheGeneration += 1;
  await caches.delete(cacheName);
  await notifyClient(event);
}

async function fetchWithCache(event) {
  const generation = cacheGeneration;
  const cache = await caches.open(cacheName);
  const cached = await cache.match(event.request);
  const fresh = fetchAndCache(cache, event);
  if (cached) {
    const revalidation = fresh.then(async (response) => {
      if (response && responsesDiffer(cached, response)) {
        await invalidateCache(event, generation);
      }
    });
    return { response: cached, revalidation: revalidation.catch(() => {}) };
  }
  return { response: fresh };
}

function handleFetch(event) {
  if (
    event.request.headers.get('cache-control') !== 'no-cache' &&
    event.request.method === 'GET' &&
    event.request.url.startsWith(self.location.origin)
  ) {
    const result = fetchWithCache(event);
    event.respondWith(result.then(({ response }) => response));
    event.waitUntil(result.then(({ revalidation }) => revalidation));
  }
}

self.addEventListener('fetch', handleFetch);

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== cacheName).map((k) => caches.delete(k)));
      await clients.claim();
    })(),
  );
});
