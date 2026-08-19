import { spawn } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';

export type Dialect = 'solid-v1' | 'solid-v2';
export type LinterEngine = 'oxlint';

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

function ancestors(from: string) {
  const chain: string[] = [];
  let current = resolve(from);
  while (true) {
    chain.push(current);
    const parent = dirname(current);
    if (parent === current) return chain;
    current = parent;
  }
}

// The Vercel function runs with the repository root as its cwd; the Vite dev
// server runs with `packages/playground` as its cwd, and `pnpm dev` can be
// invoked from anywhere. Anchoring on this module's own directory as well means
// the workspace root is found in all three cases instead of only the first.
const searchRoots = [...new Set([...ancestors(process.cwd()), ...ancestors(import.meta.dirname)])];

const repositoryRoot =
  searchRoots.find((root) => existsSync(resolve(root, 'pnpm-workspace.yaml'))) ?? resolve(process.cwd());

const moduleRoots = searchRoots.flatMap((root) => [
  resolve(root, 'node_modules'),
  resolve(root, 'packages/playground/node_modules'),
  resolve(root, 'packages/solid-repl/node_modules'),
]);

function packagePath(packageName: string, sourceName = packageName) {
  const directSource = moduleRoots.map((root) => resolve(root, sourceName)).find((candidate) => existsSync(candidate));
  if (directSource) return directSource;

  // Vercel can retain pnpm's package store without retaining the workspace
  // symlink for an aliased package such as `solid-js-v2`.
  const storeName = sourceName === 'solid-js-v2' ? 'solid-js' : sourceName;
  const storePrefix =
    storeName.startsWith('@') && !storeName.includes('/') ? `${storeName}+` : `${storeName.replace('/', '+')}@`;
  const dependencyName = packageName === '@solidjs' ? '@solidjs/web' : packageName;
  const manifest = JSON.parse(readFileSync(resolve(repositoryRoot, 'package.json'), 'utf8')) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const dependencySpec = manifest.dependencies?.[dependencyName] ?? manifest.devDependencies?.[dependencyName];
  const preferredVersion = dependencySpec?.match(/(?:^|@)(\d+\.\d+\.\d+(?:-[^/]+)?)/)?.[1];
  for (const moduleRoot of moduleRoots) {
    const storeRoot = resolve(moduleRoot, '.pnpm');
    if (!existsSync(storeRoot)) continue;
    const storeEntries = readdirSync(storeRoot)
      .filter((entry) => entry.startsWith(storePrefix))
      .filter((entry) => !preferredVersion || entry.startsWith(`${storePrefix}${preferredVersion}`))
      .sort()
      .reverse();
    for (const storeEntry of storeEntries) {
      const packageRoot = resolve(storeRoot, storeEntry, 'node_modules');
      const candidate =
        storeName.startsWith('@') && !storeName.includes('/')
          ? resolve(packageRoot, storeName)
          : resolve(packageRoot, storeName);
      if (existsSync(candidate)) return candidate;
    }
  }

  throw new Error(`Could not find installed package ${sourceName}.`);
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

function oxlintConfig() {
  return JSON.stringify({
    // Keep Oxlint's native rules in this process. Loading the checker through
    // Oxlint's ESLint JS-plugin bridge makes Oxlint allocate a second JS
    // runtime, which can abort in constrained serverless Linux runtimes.
    rules: {},
  });
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

function byteOffsetToIndex(source: string, byteOffset: number) {
  if (byteOffset <= 0) return 0;
  let bytes = 0;
  let index = 0;
  for (const character of source) {
    const width = Buffer.byteLength(character);
    if (bytes + width > byteOffset) break;
    bytes += width;
    index += character.length;
  }
  return index;
}

function sourcePosition(source: string, byteOffset: unknown) {
  const index = typeof byteOffset === 'number' ? byteOffsetToIndex(source, byteOffset) : 0;
  const prefix = source.slice(0, index);
  const lines = prefix.split(/\r\n|\n|\r/);
  return { line: lines.length, column: (lines.at(-1)?.length ?? 0) + 1 };
}

function checkerDiagnostics(source: string, output: unknown): NormalizedDiagnostic[] {
  const findings = (output as { findings?: unknown[] })?.findings;
  if (!Array.isArray(findings)) return [];
  return findings.flatMap((finding) => {
    if (!finding || typeof finding !== 'object') return [];
    const value = finding as {
      id?: unknown;
      message?: unknown;
      severity?: unknown;
      primaryLocation?: { startByte?: unknown; endByte?: unknown };
    };
    const start = sourcePosition(source, value.primaryLocation?.startByte);
    const end = sourcePosition(source, value.primaryLocation?.endByte);
    const id = typeof value.id === 'string' ? value.id : 'checker';
    const message = typeof value.message === 'string' ? value.message : 'Solid Checker reported a finding.';
    return [
      {
        line: start.line,
        endLine: end.line,
        column: start.column,
        endColumn: end.line === start.line ? Math.max(start.column + 1, end.column) : end.column,
        message: `[${id}] ${message}`,
        ruleId: 'solid-checker/certification',
        severity: value.severity === 'warning' ? 1 : 2,
      },
    ];
  });
}

interface ProcessResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

function run(command: string, args: string[], options: { cwd: string; env: NodeJS.ProcessEnv }) {
  return new Promise<ProcessResult>((resolveResult, reject) => {
    const child = spawn(command, args, { ...options, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk: string) => {
      stderr += chunk;
    });
    child.once('error', reject);
    child.once('close', (status) => resolveResult({ status, stdout, stderr }));
  });
}

function runLinter(temporaryDirectory: string, fix: boolean) {
  const configName = '.oxlintrc.json';
  writeFileSync(resolve(temporaryDirectory, configName), oxlintConfig());
  const executable = packageFile('oxlint', 'bin/oxlint');
  const args = [
    '--config',
    resolve(temporaryDirectory, configName),
    '--format',
    'json',
    '--threads=1',
    ...(fix ? ['--fix'] : []),
    'src/Playground.tsx',
  ];
  return run(process.execPath, [executable, ...args], {
    cwd: temporaryDirectory,
    env: { ...process.env, RAYON_NUM_THREADS: '1', UV_THREADPOOL_SIZE: '1' },
  });
}

function runChecker(temporaryDirectory: string, dialect: Dialect) {
  const executable = packageFile('solid-checker', 'bin/solid-checker.mjs');
  return run(
    process.execPath,
    [executable, '--project', resolve(temporaryDirectory, 'tsconfig.json'), '--format', 'json', '--dialect', dialect],
    { cwd: temporaryDirectory, env: { ...process.env, SOLID_CHECKER_DAEMON: '0' } },
  );
}

export async function runPlaygroundLint(request: LintRequest): Promise<LintResult> {
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

    // The production path intentionally keeps checker out of Oxlint's
    // jsPlugins bridge. Oxlint's native rules and solid-checker then run as
    // two bounded processes over the same source/project.
    //
    // For a plain lint the two read the source and never write it, so they run
    // concurrently and the request costs the slower of the two rather than their
    // sum. A `--fix` run rewrites the source, so there the checker has to wait
    // and analyse what Oxlint left behind.
    const engine = 'oxlint';
    const [lint, checker] = request.fix
      ? [await runLinter(temporaryDirectory, true), await runChecker(temporaryDirectory, request.dialect)]
      : await Promise.all([runLinter(temporaryDirectory, false), runChecker(temporaryDirectory, request.dialect)]);

    if (!lint.stdout.trim() && lint.stderr.trim()) {
      throw new Error(`${engine} failed: ${lint.stderr.trim()}`);
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(lint.stdout || '[]');
    } catch {
      throw new Error(lint.stderr.trim() || `${engine} returned invalid JSON output.`);
    }
    if (checker.status !== 0) {
      throw new Error(`solid-checker failed: ${checker.stderr.trim() || `exit code ${checker.status}`}`);
    }
    let checkerOutput: unknown;
    try {
      checkerOutput = JSON.parse(checker.stdout || '{}');
    } catch {
      throw new Error(checker.stderr.trim() || 'solid-checker returned invalid JSON output.');
    }
    const currentSource = readFileSync(sourceFile, 'utf8');
    const output = request.fix ? readFileSync(sourceFile, 'utf8') : undefined;
    return {
      engine,
      diagnostics: [...oxlintDiagnostics(parsed), ...checkerDiagnostics(currentSource, checkerOutput)],
      output,
      fixed: request.fix && output !== request.code,
    };
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

interface VercelRequest {
  method?: string;
  body?: unknown;
}

interface VercelResponse {
  status(code: number): VercelResponse;
  json(value: unknown): void;
}

function requestBody(value: unknown): Record<string, unknown> {
  if (typeof value === 'string') return JSON.parse(value) as Record<string, unknown>;
  if (value && typeof value === 'object') return value as Record<string, unknown>;
  return {};
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    response.status(405).json({ message: 'Only POST is supported.' });
    return;
  }
  try {
    const body = requestBody(request.body);
    if (typeof body.code !== 'string') {
      response.status(400).json({ message: 'code must be a string' });
      return;
    }
    if (body.dialect !== 'solid-v1' && body.dialect !== 'solid-v2') {
      response.status(400).json({ message: 'dialect must be solid-v1 or solid-v2' });
      return;
    }
    const result = await runPlaygroundLint({
      code: body.code,
      dialect: body.dialect as 'solid-v1' | 'solid-v2',
      fix: body.fix === true,
    });
    response.status(200).json(result);
  } catch (error) {
    response.status(500).json({ message: error instanceof Error ? error.message : String(error) });
  }
}
