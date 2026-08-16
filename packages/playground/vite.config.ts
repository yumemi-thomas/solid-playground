import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { defineConfig, type Connect, type Plugin } from 'vite';
import solidPlugin from 'vite-plugin-solid';

const repositoryRoot = resolve(import.meta.dirname, '../..');
const installedModules = resolve(repositoryRoot, 'node_modules');
const require = createRequire(import.meta.url);
const crossOriginIsolationHeaders = {
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

type Dialect = 'solid-v1' | 'solid-v2';
type LinterEngine = 'eslint' | 'oxlint';
interface LintRequest { code?: unknown; dialect?: unknown; fix?: unknown }
interface NormalizedDiagnostic {
  line: number;
  endLine: number;
  column: number;
  endColumn: number;
  message: string;
  ruleId: string | null;
  severity: number;
}

function readBody(request: Connect.IncomingMessage) {
  return new Promise<string>((resolveBody, reject) => {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', () => resolveBody(body));
    request.on('error', reject);
  });
}

function sendJson(response: Connect.ServerResponse, status: number, value: unknown) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(value));
}

function symlinkPackage(temporaryDirectory: string, packageName: string, sourceName = packageName) {
  const source = [
    resolve(installedModules, sourceName),
    resolve(repositoryRoot, 'packages/playground/node_modules', sourceName),
    resolve(repositoryRoot, 'packages/solid-repl/node_modules', sourceName),
  ].find((candidate) => existsSync(candidate));
  if (!source) return;
  const target = resolve(temporaryDirectory, 'node_modules', packageName);
  mkdirSync(resolve(target, '..'), { recursive: true });
  symlinkSync(source, target, 'dir');
}

function checkerConfig(temporaryDirectory: string, dialect: Dialect) {
  const checkerPlugin = pathToFileURL(resolve(installedModules, 'solid-checker/eslint.cjs')).href;
  const parser = pathToFileURL(require.resolve('@typescript-eslint/parser')).href;
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
    jsPlugins: [resolve(installedModules, 'solid-checker/eslint.cjs')],
    settings: { solidChecker: { dialect } },
    rules: { 'solid-checker/certification': 'error' },
  });
}

function eslintDiagnostics(output: unknown): NormalizedDiagnostic[] {
  if (!Array.isArray(output)) return [];
  return output.flatMap((file) => Array.isArray(file?.messages) ? file.messages.map((diagnostic: Record<string, unknown>) => ({
    line: typeof diagnostic.line === 'number' ? diagnostic.line : 1,
    endLine: typeof diagnostic.endLine === 'number' ? diagnostic.endLine : (diagnostic.line as number) || 1,
    column: typeof diagnostic.column === 'number' ? diagnostic.column : 1,
    endColumn: typeof diagnostic.endColumn === 'number' ? diagnostic.endColumn : ((diagnostic.column as number) || 1) + 1,
    message: typeof diagnostic.message === 'string' ? diagnostic.message : 'ESLint reported a finding.',
    ruleId: typeof diagnostic.ruleId === 'string' ? diagnostic.ruleId : null,
    severity: diagnostic.severity === 1 ? 1 : 2,
  })) : []);
}

function oxlintDiagnostics(output: unknown): NormalizedDiagnostic[] {
  const diagnostics = Array.isArray(output) ? output : (output as { diagnostics?: unknown[] })?.diagnostics;
  if (!Array.isArray(diagnostics)) return [];
  return diagnostics.map((diagnostic: Record<string, unknown>) => {
    const span = (diagnostic.labels as Array<{ span?: { line?: number; column?: number; length?: number } }> | undefined)?.[0]?.span;
    const line = span?.line ?? 1;
    const column = span?.column ?? 1;
    return {
      line, endLine: line, column, endColumn: column + (span?.length ?? 1),
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
  writeFileSync(resolve(temporaryDirectory, configName), engine === 'oxlint' ? oxlintConfig(dialect) : checkerConfig(temporaryDirectory, dialect));
  const executable = engine === 'oxlint' ? resolve(installedModules, 'oxlint/bin/oxlint') : resolve(installedModules, 'eslint/bin/eslint.js');
  const args = ['--config', resolve(temporaryDirectory, configName), '--format', 'json', ...(fix ? ['--fix'] : []), 'src/Playground.tsx'];
  return spawnSync(process.execPath, [executable, ...args], { cwd: temporaryDirectory, encoding: 'utf8', env: process.env });
}

function playgroundLint(): Plugin {
  return {
    name: 'solid-playground-lint',
    configureServer(server) { server.middlewares.use(lintMiddleware()); },
    configurePreviewServer(server) { server.middlewares.use(lintMiddleware()); },
  };
}

function lintMiddleware(): Connect.NextHandleFunction {
  return async (request, response, next) => {
    if (request.method !== 'POST' || request.url !== '/__solid-playground/lint') { next(); return; }
    let temporaryDirectory: string | undefined;
    try {
      const body = JSON.parse(await readBody(request)) as LintRequest;
      if (typeof body.code !== 'string') { sendJson(response, 400, { message: 'code must be a string' }); return; }
      if (body.dialect !== 'solid-v1' && body.dialect !== 'solid-v2') {
        sendJson(response, 400, { message: 'dialect must be solid-v1 or solid-v2' }); return;
      }
      temporaryDirectory = mkdtempSync(resolve(tmpdir(), 'solid-playground-lint-'));
      const sourceDirectory = resolve(temporaryDirectory, 'src');
      mkdirSync(sourceDirectory, { recursive: true });
      const sourceFile = resolve(sourceDirectory, 'Playground.tsx');
      writeFileSync(sourceFile, body.code);
      writeFileSync(resolve(temporaryDirectory, 'tsconfig.json'), JSON.stringify({
        compilerOptions: {
          jsx: 'preserve', jsxImportSource: body.dialect === 'solid-v2' ? '@solidjs/web' : 'solid-js',
          module: 'ESNext', moduleResolution: 'Bundler', noEmit: true, strict: true, target: 'ES2022',
        }, include: ['src/Playground.tsx'],
      }));
      for (const packageName of ['solid-checker', 'solid-checker-wasm', '@solidjs']) symlinkPackage(temporaryDirectory, packageName);
      symlinkPackage(temporaryDirectory, 'solid-js', body.dialect === 'solid-v2' ? 'solid-js-v2' : 'solid-js');
      const engine = selectedEngine();
      const lint = runLinter(temporaryDirectory, body.dialect, body.fix === true, engine);
      if (lint.error) { sendJson(response, 500, { message: lint.error.message }); return; }
      let parsed: unknown;
      try { parsed = JSON.parse(lint.stdout || '[]'); }
      catch { sendJson(response, 500, { message: lint.stderr.trim() || `${engine} returned invalid JSON output.` }); return; }
      const diagnostics = engine === 'oxlint' ? oxlintDiagnostics(parsed) : eslintDiagnostics(parsed);
      const output = body.fix === true ? readFileSync(sourceFile, 'utf8') : undefined;
      sendJson(response, 200, { engine, diagnostics, output, fixed: body.fix === true && output !== body.code });
    } catch (error) {
      sendJson(response, 400, { message: error instanceof Error ? error.message : String(error) });
    } finally {
      if (temporaryDirectory) rmSync(temporaryDirectory, { recursive: true, force: true });
    }
  };
}

export default defineConfig((env) => ({
  plugins: [solidPlugin(), playgroundLint()],
  resolve: { alias: { 'styled-system': resolve(repositoryRoot, 'styled-system') } },
  define: { 'process.env.NODE_DEBUG': 'false', ...(env.command === 'build' ? {} : { global: 'globalThis' }) },
  build: {
    target: 'esnext',
    rolldownOptions: { output: { entryFileNames: 'assets/[name].js', chunkFileNames: 'assets/[name].js', assetFileNames: 'assets/[name].[ext]' } },
  },
  worker: { format: 'es', rolldownOptions: { output: { entryFileNames: 'assets/[name].js' } } },
  server: {
    proxy: { '/api': { target: 'http://localhost:8787', changeOrigin: true, rewrite: (path) => path.replace(/^\/api/, '') } },
    headers: crossOriginIsolationHeaders,
  },
  preview: { headers: crossOriginIsolationHeaders },
}));
