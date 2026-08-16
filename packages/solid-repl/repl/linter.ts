import { isSolidV2 } from '../src/kernel/importMap';
import { serveWorker } from '../src/kernel/workerServer';

type Dialect = 'solid-v1' | 'solid-v2';

export interface LinterWorkerPayload {
  code: string;
  version?: string;
  dialect?: Dialect;
}

export interface LintMarker {
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
  message: string;
  severity: number;
}

interface ServerDiagnostic {
  line?: number;
  endLine?: number;
  column?: number;
  endColumn?: number;
  message?: string;
  ruleId?: string | null;
  severity?: number;
}

interface ServerResponse {
  engine?: string;
  diagnostics?: ServerDiagnostic[];
  output?: string;
  fixed?: boolean;
  message?: string;
}

function isServerResponse(value: unknown): value is ServerResponse {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as ServerResponse).engine === 'string' &&
    Array.isArray((value as ServerResponse).diagnostics)
  );
}

const lintEndpoint = '/__solid-playground/lint';

const dialectFor = (payload: LinterWorkerPayload): Dialect =>
  payload.dialect ?? (isSolidV2(payload.version) ? 'solid-v2' : 'solid-v1');

const diagnosticsToMarkers = (diagnostics: ServerDiagnostic[], engine: string): LintMarker[] =>
  diagnostics.map((diagnostic) => ({
    startLineNumber: diagnostic.line ?? 1,
    endLineNumber: diagnostic.endLine ?? diagnostic.line ?? 1,
    startColumn: diagnostic.column ?? 1,
    endColumn: diagnostic.endColumn ?? diagnostic.column ?? 1,
    message: `${diagnostic.message ?? 'Linter reported a finding.'}\n${engine}(${diagnostic.ruleId ?? 'unknown'})`,
    severity: diagnostic.severity === 1 ? 4 : 8,
  }));

function byteOffsetToIndex(source: string, byteOffset: number) {
  if (byteOffset <= 0) return 0;
  const bytes = new TextEncoder().encode(source);
  return Math.min(source.length, new TextDecoder().decode(bytes.slice(0, byteOffset)).length);
}

function wasmFindingMarkers(
  source: string,
  findings: Array<{ id?: string; message?: string; primaryLocation?: { startByte?: number; endByte?: number } }>,
) {
  return findings.map((finding) => {
    const start = byteOffsetToIndex(source, finding.primaryLocation?.startByte ?? 0);
    const end = byteOffsetToIndex(source, finding.primaryLocation?.endByte ?? start + 1);
    const before = source.slice(0, start);
    const endBefore = source.slice(0, end);
    return {
      startLineNumber: before.split('\n').length,
      endLineNumber: endBefore.split('\n').length,
      startColumn: start - before.lastIndexOf('\n'),
      endColumn: end - endBefore.lastIndexOf('\n'),
      message: `${finding.message ?? 'WASM checker reported a finding.'}\nwasm(${finding.id ?? 'solid-checker'})`,
      severity: 8,
    } satisfies LintMarker;
  });
}

async function lintWithWasm(payload: LinterWorkerPayload): Promise<ServerResponse> {
  if (self.crossOriginIsolated !== true || typeof SharedArrayBuffer === 'undefined') {
    throw new Error('The browser WASM fallback needs cross-origin isolation (COOP/COEP and SharedArrayBuffer).');
  }
  const { checkSync } = await import('solid-checker-wasm');
  const projectId = '/solid-playground/tsconfig.json';
  const sourcePath = '/solid-playground/src/Playground.tsx';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload.code));
  const sha256 = `sha256:${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
  const snapshot = JSON.parse(
    checkSync(
      JSON.stringify({
        projectId,
        dialect: dialectFor(payload),
        generation: 1,
        sources: [
          {
            path: sourcePath,
            source: payload.code,
            compilerOptions: {
              moduleName: 'dom',
              generate: 'dom',
              hydratable: false,
              dev: false,
              effectWrapper: '',
              wrapConditionals: true,
              staticMarker: '_$',
              builtIns: [],
            },
          },
        ],
        typeFacts: {
          schema: 2,
          generation: 1,
          projectId,
          sources: [{ path: sourcePath, sha256 }],
          entities: [],
          symbols: [],
          files: [],
        },
      }),
    ),
  );
  const findings = Array.isArray(snapshot.findings) ? snapshot.findings : [];
  return {
    engine: 'wasm',
    diagnostics: wasmFindingMarkers(payload.code, findings),
  };
}

async function lint(payload: LinterWorkerPayload, fix: boolean) {
  try {
    const response = await fetch(lintEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: payload.code, dialect: dialectFor(payload), fix }),
    });
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().includes('application/json')) {
      throw new Error(`Linter endpoint returned ${contentType || 'a non-JSON response'} (${response.status}).`);
    }
    let result: unknown;
    try {
      result = await response.json();
    } catch {
      throw new Error(`Linter endpoint returned invalid JSON (${response.status}).`);
    }
    if (!response.ok) {
      const message =
        result && typeof result === 'object' && typeof (result as ServerResponse).message === 'string'
          ? (result as ServerResponse).message
          : `Linter server returned ${response.status}`;
      throw new Error(message);
    }
    if (!isServerResponse(result)) throw new Error('Linter endpoint returned an invalid result.');
    return result;
  } catch (error) {
    if (fix) throw error;
    return lintWithWasm(payload);
  }
}

serveWorker({
  LINT: async (payload: LinterWorkerPayload) => {
    const result = await lint(payload, false);
    return {
      markers:
        result.engine === 'wasm'
          ? (result.diagnostics ?? [])
          : diagnosticsToMarkers(result.diagnostics ?? [], result.engine ?? 'eslint'),
    };
  },
  FIX: async (payload: LinterWorkerPayload) => {
    const result = await lint(payload, true);
    return {
      markers: diagnosticsToMarkers(result.diagnostics ?? [], result.engine ?? 'eslint'),
      output: result.output,
      fixed: result.fixed ?? false,
    };
  },
});
