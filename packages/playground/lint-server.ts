import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export type Dialect = 'solid-v1' | 'solid-v2';
export type LinterEngine = 'eslint' | 'oxlint';

export interface LintRequest {
  code: string;
  dialect: Dialect;
  fix: boolean;
}

export interface NormalizedDiagnostic {
  line: number;
  endLine: number;
  column: number;
  endColumn: number;
  message: string;
  ruleId: string | null;
  severity: number;
}

export interface LintResult {
  engine: LinterEngine;
  diagnostics: NormalizedDiagnostic[];
  output?: string;
  fixed: boolean;
}

const repositoryRoot = resolve(process.cwd());
const moduleRoots = [process.cwd(), repositoryRoot].flatMap((root) => [
  resolve(root, 'node_modules'),
  resolve(root, 'packages/playground/node_modules'),
  resolve(root, 'packages/solid-repl/node_modules'),
]);

function packagePath(packageName: string, sourceName = packageName) {
  const source = moduleRoots.map((root) => resolve(root, sourceName)).find((candidate) => existsSync(candidate));
  if (!source) throw new Error(`Could not find installed package ${sourceName}.`);
  return source;
}

function packageFile(packageName: string, fileName: string) {
  return resolve(packagePath(packageName), fileName);
}

function symlinkPackage(temporaryDirectory: string, packageName: string, sourceName = packageName) {
  const source = packagePath(packageName, sourceName);
  const target = resolve(temporaryDirectory, 'node_modules', packageName);
  mkdirSync(dirname(target), { recursive: true });
  symlinkSync(source, target, 'dir');
}

function checkerConfig(temporaryDirectory: string, dialect: Dialect) {
  const checkerPlugin = pathToFileURL(packageFile('solid-checker', 'eslint.cjs')).href;
  const parser = pathToFileURL(packageFile('@typescript-eslint/parser', 'dist/index.js')).href;
  return `import checker from ${JSON.stringify(checkerPlugin)};
import parser from ${JSON.stringify(parser)};
export default [{
  files: ['**/*.tsx'],
  languageOptions: {
    parser,
    parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },
  },
  plugins: { 'solid-checker': checker },
  settings: { solidChecker: {
    cwd: ${JSON.stringify(temporaryDirectory)},
    project: './tsconfig.json',
    dialect: ${JSON.stringify(dialect)},
  } },
  rules: { 'solid-checker/certification': 'error' },
}];
`;
}

function oxlintConfig(dialect: Dialect) {
  return JSON.stringify({
    jsPlugins: [packageFile('solid-checker', 'eslint.cjs')],
    settings: { solidChecker: { dialect } },
    rules: { 'solid-checker/certification': 'error' },
  });
}

function eslintDiagnostics(output: unknown): NormalizedDiagnostic[] {
  if (!Array.isArray(output)) return [];
  return output.flatMap((file) =>
    Array.isArray(file?.messages)
      ? file.messages.map((diagnostic: Record<string, unknown>) => ({
          line: typeof diagnostic.line === 'number' ? diagnostic.line : 1,
          endLine: typeof diagnostic.endLine === 'number' ? diagnostic.endLine : (diagnostic.line as number) || 1,
          column: typeof diagnostic.column === 'number' ? diagnostic.column : 1,
          endColumn:
            typeof diagnostic.endColumn === 'number' ? diagnostic.endColumn : ((diagnostic.column as number) || 1) + 1,
          message: typeof diagnostic.message === 'string' ? diagnostic.message : 'ESLint reported a finding.',
          ruleId: typeof diagnostic.ruleId === 'string' ? diagnostic.ruleId : null,
          severity: diagnostic.severity === 1 ? 1 : 2,
        }))
      : [],
  );
}

function oxlintDiagnostics(output: unknown): NormalizedDiagnostic[] {
  const diagnostics = Array.isArray(output) ? output : (output as { diagnostics?: unknown[] })?.diagnostics;
  if (!Array.isArray(diagnostics)) return [];
  return diagnostics.map((diagnostic: Record<string, unknown>) => {
    const span = (
      diagnostic.labels as Array<{ span?: { line?: number; column?: number; length?: number } }> | undefined
    )?.[0]?.span;
    const line = span?.line ?? 1;
    const column = span?.column ?? 1;
    return {
      line,
      endLine: line,
      column,
      endColumn: column + (span?.length ?? 1),
      message: typeof diagnostic.message === 'string' ? diagnostic.message : 'Oxlint reported a finding.',
      ruleId: typeof diagnostic.code === 'string' ? diagnostic.code : null,
      severity: diagnostic.severity === 'warning' ? 1 : 2,
    };
  });
}

function selectedEngine(): LinterEngine {
  return process.env.SOLID_PLAYGROUND_LINTER === 'eslint' ? 'eslint' : 'oxlint';
}

function runLinter(temporaryDirectory: string, dialect: Dialect, fix: boolean, engine: LinterEngine) {
  const configName = engine === 'oxlint' ? '.oxlintrc.json' : 'eslint.config.mjs';
  writeFileSync(
    resolve(temporaryDirectory, configName),
    engine === 'oxlint' ? oxlintConfig(dialect) : checkerConfig(temporaryDirectory, dialect),
  );
  const executable = engine === 'oxlint' ? packageFile('oxlint', 'bin/oxlint') : packageFile('eslint', 'bin/eslint.js');
  const args = [
    '--config',
    resolve(temporaryDirectory, configName),
    '--format',
    'json',
    ...(fix ? ['--fix'] : []),
    'src/Playground.tsx',
  ];
  return spawnSync(process.execPath, [executable, ...args], {
    cwd: temporaryDirectory,
    encoding: 'utf8',
    env: process.env,
  });
}

export function runPlaygroundLint(request: LintRequest): LintResult {
  const temporaryDirectory = mkdtempSync(resolve(tmpdir(), 'solid-playground-lint-'));
  try {
    const sourceDirectory = resolve(temporaryDirectory, 'src');
    mkdirSync(sourceDirectory, { recursive: true });
    const sourceFile = resolve(sourceDirectory, 'Playground.tsx');
    writeFileSync(sourceFile, request.code);
    writeFileSync(
      resolve(temporaryDirectory, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          jsx: 'preserve',
          jsxImportSource: request.dialect === 'solid-v2' ? '@solidjs/web' : 'solid-js',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          noEmit: true,
          strict: true,
          target: 'ES2022',
        },
        include: ['src/Playground.tsx'],
      }),
    );
    for (const packageName of ['solid-checker', '@solidjs']) symlinkPackage(temporaryDirectory, packageName);
    symlinkPackage(temporaryDirectory, 'solid-js', request.dialect === 'solid-v2' ? 'solid-js-v2' : 'solid-js');

    const engine = selectedEngine();
    const lint = runLinter(temporaryDirectory, request.dialect, request.fix, engine);
    if (lint.error) throw lint.error;
    let parsed: unknown;
    try {
      parsed = JSON.parse(lint.stdout || '[]');
    } catch {
      throw new Error(lint.stderr.trim() || `${engine} returned invalid JSON output.`);
    }
    const output = request.fix ? readFileSync(sourceFile, 'utf8') : undefined;
    return {
      engine,
      diagnostics: engine === 'oxlint' ? oxlintDiagnostics(parsed) : eslintDiagnostics(parsed),
      output,
      fixed: request.fix && output !== request.code,
    };
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}
