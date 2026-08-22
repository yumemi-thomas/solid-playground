import assert from 'node:assert/strict';

const { runPlaygroundLint, runPlaygroundLintBatch } = await import('../api/solid-playground-lint.ts');

const request = {
  code: 'function Bad(props: { name: string }) { const name = props.name; return <h1>{name}</h1>; }',
  dialect: 'solid-v2',
  fix: false,
};
const result = await runPlaygroundLint(request);

assert.equal(result.engine, 'oxlint');
assert.ok(
  result.diagnostics.some((diagnostic) => diagnostic.ruleId === 'eslint(no-unused-vars)'),
  'expected a native Oxlint diagnostic',
);
assert.ok(
  result.diagnostics.some(
    (diagnostic) => diagnostic.ruleId === 'solid-checker/certification' && diagnostic.message.includes('[SC1001]'),
  ),
  'expected the Solid Checker SC1001 diagnostic',
);

const batchRequests = [
  request,
  {
    code: 'import { For } from "solid-js"; const values = [1, 2]; export const List = () => <>{values.map(value => <p>{value}</p>)}</>;',
    dialect: 'solid-v2',
    fix: false,
    rule: 'prefer-for',
  },
  {
    code: 'export function Greeting(props: { name: string }) { return <h1>{props.name}</h1>; }',
    dialect: 'solid-v1',
    fix: false,
  },
];
const [individual, batched] = await Promise.all([
  Promise.all(batchRequests.map(runPlaygroundLint)),
  runPlaygroundLintBatch(batchRequests),
]);
assert.deepEqual(batched, individual, 'batched linting must preserve single-request diagnostics and attribution');

console.log('Oxlint and Solid Checker diagnostics are present, and batch results match individual requests.');
