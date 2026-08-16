import assert from 'node:assert/strict';

const { runPlaygroundLint } = await import('../api/solid-playground-lint.ts');

const result = runPlaygroundLint({
  code: 'function Bad(props: { name: string }) { const name = props.name; return <h1>{name}</h1>; }',
  dialect: 'solid-v2',
  fix: false,
});

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

console.log('Oxlint and Solid Checker diagnostics are both present.');
