// Verifies every rule example against the linter the playground actually runs.
//
//   node --experimental-strip-types scripts/verify-examples.mjs [--dialect solid-v2] [--rule <substring>]
//
// For each catalog entry the script asserts that, once composed with the header
// the playground prepends,
//   * `incorrect.tsx` reports the entry's diagnostic code and nothing else,
//   * `correct.tsx` reports nothing at all,
//   * both files typecheck, so the editor shows only the checker's findings.
// Entries marked `standalone: false` are only required to typecheck: they
// document a rule a single playground file cannot reproduce.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';

const repositoryRoot = resolve(import.meta.dirname, '..');
const examplesRoot = resolve(repositoryRoot, 'packages/playground/examples');

const { runPlaygroundLintBatch } = await import(resolve(repositoryRoot, 'api/solid-playground-lint.ts'));
const { EXAMPLES_BY_DIALECT } = await import(resolve(repositoryRoot, 'packages/playground/src/examples/catalog.ts'));
const { composeExample } = await import(resolve(repositoryRoot, 'packages/playground/src/examples/composeExample.ts'));

const args = process.argv.slice(2);
const optionOf = (name) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
};
const dialectFilter = optionOf('dialect');
const ruleFilter = optionOf('rule');
const skipTypes = args.includes('--no-types');

function manifestFor(dialect) {
  const path = resolve(repositoryRoot, `node_modules/solid-checker/lib/rules-${dialect}.json`);
  return JSON.parse(readFileSync(path, 'utf8'));
}

function typecheck(dialect, files) {
  const tsconfig = resolve(examplesRoot, dialect, 'tsconfig.check.json');
  const tsc = resolve(repositoryRoot, 'packages/playground/node_modules/typescript/bin/tsc');
  return new Promise((resolveErrors, reject) => {
    const child = spawn(process.execPath, [tsc, '-p', tsconfig, '--noEmit'], {
      cwd: repositoryRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      output += chunk;
    });
    child.stderr.on('data', (chunk) => {
      output += chunk;
    });
    child.once('error', reject);
    child.once('close', () => resolveErrors(typeErrorsFromOutput(output, files)));
  });
}

function typeErrorsFromOutput(output, files) {
  const byFile = new Map();
  for (const line of output.split('\n')) {
    const match = /^(.*?)\((\d+),(\d+)\): (error .*)$/.exec(line.trim());
    if (!match) continue;
    const file = resolve(repositoryRoot, match[1]);
    if (!files.has(file)) continue;
    const list = byFile.get(file) ?? [];
    list.push(`${match[2]}:${match[3]} ${match[4]}`);
    byFile.set(file, list);
  }
  return byFile;
}

function checkEntry(dialect, entry, declared, typeErrors, lintByKind) {
  const failures = [];
  const notes = [];
  let checked = 0;

  {
    if (!declared) {
      failures.push(`${dialect} ${entry.rule}: not in the installed solid-checker catalog`);
      return { failures, notes, checked };
    }
    if (declared.code !== entry.code) {
      failures.push(`${dialect} ${entry.rule}: catalog says ${declared.code}, entry says ${entry.code}`);
    }
    if (declared.severity !== entry.severity) {
      failures.push(`${dialect} ${entry.rule}: catalog says ${declared.severity}, entry says ${entry.severity}`);
    }

    for (const kind of ['incorrect', 'correct']) {
      const file = resolve(examplesRoot, dialect, entry.dir, `${kind}.tsx`);
      if (!existsSync(file)) {
        failures.push(`${dialect} ${entry.rule}: missing ${kind}.tsx`);
        continue;
      }
      if (!skipTypes) {
        const typeProblems = typeErrors.get(file);
        const typeErrorsExpected = entry.alsoTypeError === true && kind === 'incorrect';
        if (typeProblems && !typeErrorsExpected) {
          failures.push(`${dialect} ${entry.rule} ${kind}.tsx: does not typecheck\n    ${typeProblems.join('\n    ')}`);
        }
        if (!typeProblems && typeErrorsExpected) {
          failures.push(`${dialect} ${entry.rule} incorrect.tsx: alsoTypeError is set but tsc is silent`);
        }
      }

      const result = lintByKind.get(kind);
      if (!result) {
        failures.push(`${dialect} ${entry.rule} ${kind}.tsx: was not analysed`);
        continue;
      }
      checked += 1;
      const native = result.diagnostics.filter((d) => d.ruleId !== 'solid-checker/certification');
      const codes = result.diagnostics
        .filter((d) => d.ruleId === 'solid-checker/certification')
        .map((d) => /^\[(SC\d+)\]/.exec(d.message)?.[1] ?? 'unknown');

      if (native.length) {
        failures.push(
          `${dialect} ${entry.rule} ${kind}.tsx: unrelated lint findings\n    ${native
            .map((d) => `${d.line}:${d.column} ${d.ruleId} ${d.message}`)
            .join('\n    ')}`,
        );
      }

      if (kind === 'correct') {
        if (codes.length) failures.push(`${dialect} ${entry.rule} correct.tsx: reports ${codes.join(', ')}`);
        continue;
      }

      if (entry.standalone === false) {
        notes.push(`${dialect} ${entry.rule}: documented only, reports ${codes.length ? codes.join(', ') : 'nothing'}`);
        continue;
      }
      if (!codes.includes(entry.code)) {
        failures.push(
          `${dialect} ${entry.rule} incorrect.tsx: expected ${entry.code}, got ${codes.length ? codes.join(', ') : 'nothing'}`,
        );
      }
      const allowed = new Set([entry.code, ...(entry.alsoReports ?? [])]);
      for (const expected of entry.alsoReports ?? []) {
        if (!codes.includes(expected)) {
          failures.push(`${dialect} ${entry.rule} incorrect.tsx: alsoReports lists ${expected}, which is not reported`);
        }
      }
      const extra = codes.filter((c) => !allowed.has(c));
      if (extra.length) {
        failures.push(`${dialect} ${entry.rule} incorrect.tsx: also reports ${[...new Set(extra)].join(', ')}`);
      }
    }
  }

  return { failures, notes, checked };
}

const failures = [];
const notes = [];
let checked = 0;
const dialectPlans = [];
const lintRequests = [];
const lintTargets = [];

for (const [dialect, entries] of Object.entries(EXAMPLES_BY_DIALECT)) {
  if (dialectFilter && dialect !== dialectFilter) continue;
  const manifest = manifestFor(dialect);
  const manifestByName = new Map(manifest.rules.map((rule) => [rule.name, rule]));

  const typeTargets = new Set();
  for (const entry of entries) {
    for (const kind of ['incorrect', 'correct']) {
      typeTargets.add(resolve(examplesRoot, dialect, entry.dir, `${kind}.tsx`));
    }
  }
  const selected = entries.filter((entry) => !ruleFilter || entry.rule.includes(ruleFilter));
  const entryPlans = selected.map((entry) => {
    const declared = manifestByName.get(entry.rule);
    const lintByKind = new Map();
    if (declared) {
      for (const kind of ['incorrect', 'correct']) {
        const file = resolve(examplesRoot, dialect, entry.dir, `${kind}.tsx`);
        if (!existsSync(file)) continue;
        lintRequests.push({
          code: composeExample(entry, kind, readFileSync(file, 'utf8')),
          dialect,
          fix: false,
          rule: entry.rule,
          // Server-function transport analysis is intentionally project-wide.
          // Keep each shipped snippet isolated exactly as it is in the REPL.
          batchKey: entry.rule === 'server-function-rich-argument' ? `${entry.dir}-${kind}` : undefined,
        });
        lintTargets.push({ kind, lintByKind });
      }
    }
    return { entry, declared, lintByKind };
  });
  dialectPlans.push({
    dialect,
    entryPlans,
    typeErrors: skipTypes ? Promise.resolve(new Map()) : typecheck(dialect, typeTargets),
  });
}

// TypeScript checks both dialect projects while Oxlint and Solid Checker
// analyse shared batch projects grouped by dialect and checker preset.
const [lintResults, ...typeErrorsByDialect] = await Promise.all([
  runPlaygroundLintBatch(lintRequests),
  ...dialectPlans.map((plan) => plan.typeErrors),
]);
for (let index = 0; index < lintResults.length; index += 1) {
  const target = lintTargets[index];
  target.lintByKind.set(target.kind, lintResults[index]);
}

for (let dialectIndex = 0; dialectIndex < dialectPlans.length; dialectIndex += 1) {
  const plan = dialectPlans[dialectIndex];
  const typeErrors = typeErrorsByDialect[dialectIndex];
  for (const { entry, declared, lintByKind } of plan.entryPlans) {
    const result = checkEntry(plan.dialect, entry, declared, typeErrors, lintByKind);
    failures.push(...result.failures);
    notes.push(...result.notes);
    checked += result.checked;
  }
}

for (const note of notes) console.log(`note: ${note}`);
if (failures.length) {
  console.error(`\n${failures.length} problem(s):\n`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`\nAll ${checked} example file(s) behave as documented.`);
}
