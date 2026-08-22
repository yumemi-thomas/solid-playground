export type Dialect = 'solid-v1' | 'solid-v2';

export interface LinterWorkerPayload {
  code: string;
  version?: string;
  dialect?: Dialect;
  rule?: string;
}

export interface LintMarker {
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
  message: string;
  severity: number;
}

export interface ServerDiagnostic {
  line?: number;
  endLine?: number;
  column?: number;
  endColumn?: number;
  message?: string;
  ruleId?: string | null;
  severity?: number;
}

export interface ServerResponse {
  engine?: string;
  diagnostics?: ServerDiagnostic[];
  output?: string;
  fixed?: boolean;
  message?: string;
}

export interface PrimedLintEntry extends LinterWorkerPayload {
  markers: LintMarker[];
}

export interface PrimeLintPayload {
  entries: PrimedLintEntry[];
}

export const diagnosticsToMarkers = (diagnostics: ServerDiagnostic[], engine: string): LintMarker[] =>
  diagnostics.map((diagnostic) => ({
    startLineNumber: diagnostic.line ?? 1,
    endLineNumber: diagnostic.endLine ?? diagnostic.line ?? 1,
    startColumn: diagnostic.column ?? 1,
    endColumn: diagnostic.endColumn ?? diagnostic.column ?? 1,
    message: `${diagnostic.message ?? 'Linter reported a finding.'}\n${engine}(${diagnostic.ruleId ?? 'unknown'})`,
    severity: diagnostic.severity === 1 ? 4 : 8,
  }));
