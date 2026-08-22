import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const serviceWorkerSource = await readFile(new URL('../public/sw.js', import.meta.url), 'utf8');

class MemoryCache {
  constructor(entries = []) {
    this.entries = new Map(entries);
  }

  async match(request) {
    return this.entries.get(typeof request === 'string' ? request : request.url);
  }

  async put(request, response) {
    this.entries.set(typeof request === 'string' ? request : request.url, response);
  }
}

function response(etag) {
  return {
    ok: true,
    headers: { get: (name) => (name === 'etag' ? etag : null) },
    clone() {
      return response(etag);
    },
  };
}

function createHarness() {
  const origin = 'https://playground.test';
  const appUrl = `${origin}/assets/app.js`;
  const exampleUrl = `${origin}/assets/example.js`;
  let activeCache = new MemoryCache([
    [appUrl, response('old-app')],
    [exampleUrl, response('old-example')],
  ]);
  const listeners = new Map();
  const messages = [];

  const context = {
    console,
    fetch: async (request) => {
      if (request.url === appUrl) return response('new-app');
      if (request.url === exampleUrl) return response('new-example');
      throw new Error(`Unexpected request: ${request.url}`);
    },
    caches: {
      async open() {
        return activeCache;
      },
      async keys() {
        return ['my-cache'];
      },
      async delete() {
        activeCache = new MemoryCache();
        return true;
      },
    },
    clients: {
      async get() {
        return { postMessage: (message) => messages.push(message) };
      },
      async matchAll() {
        return [];
      },
      async claim() {},
    },
    self: {
      location: { origin },
      addEventListener(type, listener) {
        listeners.set(type, listener);
      },
      skipWaiting() {},
    },
  };

  vm.runInNewContext(serviceWorkerSource, context, { filename: 'sw.js' });

  async function request(url) {
    const background = [];
    let responsePromise;
    listeners.get('fetch')({
      clientId: 'page',
      request: {
        url,
        method: 'GET',
        mode: 'cors',
        headers: { get: () => null },
      },
      respondWith(value) {
        responsePromise = Promise.resolve(value);
      },
      waitUntil(value) {
        background.push(Promise.resolve(value));
      },
    });
    await responsePromise;
    await Promise.all(background);
    await new Promise((resolve) => setImmediate(resolve));
  }

  return { appUrl, exampleUrl, messages, request };
}

test('an acknowledged cache update is not reported again when another example loads', async () => {
  const harness = createHarness();

  await harness.request(harness.appUrl);
  assert.equal(harness.messages.length, 1, 'the changed app asset should announce the update');

  // The user refreshes here. The next example is fetched by the newly loaded page.
  await harness.request(harness.exampleUrl);
  assert.equal(harness.messages.length, 1, 'the next lazy-loaded example should not announce the same update again');
});

test('concurrent stale assets announce one update', async () => {
  const harness = createHarness();

  await Promise.all([harness.request(harness.appUrl), harness.request(harness.exampleUrl)]);

  assert.equal(harness.messages.length, 1);
});
