import assert from 'node:assert/strict';
import test from 'node:test';

import { createLinterHandlers } from '../repl/linterHandlers.ts';

const dialectFor = (payload) => payload.dialect ?? 'solid-v2';
const payload = {
  code: 'export const Example = () => <div />;',
  dialect: 'solid-v2',
  rule: 'strict-read-untracked',
};

test('primed example diagnostics skip the live lint transport, including clean results', async () => {
  let transportCalls = 0;
  const handlers = createLinterHandlers(async () => {
    transportCalls += 1;
    return { engine: 'oxlint', diagnostics: [] };
  }, dialectFor);

  handlers.PRIME({ entries: [{ ...payload, markers: [] }] });
  assert.deepEqual(await handlers.LINT(payload), { markers: [] });
  assert.equal(transportCalls, 0);
});

test('identical concurrent lints share one transport request', async () => {
  let transportCalls = 0;
  let finish;
  const response = new Promise((resolve) => {
    finish = resolve;
  });
  const handlers = createLinterHandlers(async () => {
    transportCalls += 1;
    return response;
  }, dialectFor);

  const first = handlers.LINT(payload);
  const second = handlers.LINT(payload);
  assert.equal(transportCalls, 1);

  finish({ engine: 'oxlint', diagnostics: [] });
  assert.deepEqual(await Promise.all([first, second]), [{ markers: [] }, { markers: [] }]);
});
