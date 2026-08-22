import {
  diagnosticsToMarkers,
  type Dialect,
  type LinterWorkerPayload,
  type LintMarker,
  type PrimeLintPayload,
  type ServerResponse,
} from './linterProtocol.ts';

type ResolveDialect = (payload: LinterWorkerPayload) => Dialect;
type LintTransport = (payload: LinterWorkerPayload, fix: boolean) => Promise<ServerResponse>;

const CACHE_LIMIT = 24;

export function createLinterHandlers(lint: LintTransport, dialectFor: ResolveDialect, cacheLimit = CACHE_LIMIT) {
  const cache = new Map<string, LintMarker[]>();
  const inFlight = new Map<string, Promise<LintMarker[]>>();

  const keyFor = (payload: LinterWorkerPayload) => `${dialectFor(payload)}\0${payload.rule ?? ''}\0${payload.code}`;

  const cached = (key: string, markers: LintMarker[]) => {
    cache.delete(key);
    cache.set(key, markers);
    if (cache.size > cacheLimit) cache.delete(cache.keys().next().value!);
    return markers;
  };

  const cacheHit = (key: string) => {
    const markers = cache.get(key);
    if (markers === undefined) return undefined;
    return cached(key, markers);
  };

  return {
    PRIME: ({ entries }: PrimeLintPayload) => {
      for (const entry of entries) cached(keyFor(entry), entry.markers);
      return {};
    },

    LINT: async (payload: LinterWorkerPayload) => {
      const key = keyFor(payload);
      const hit = cacheHit(key);
      if (hit !== undefined) return { markers: hit };

      const pending = inFlight.get(key);
      if (pending) return { markers: await pending };

      const request = lint(payload, false).then((result) =>
        cached(key, diagnosticsToMarkers(result.diagnostics ?? [], result.engine ?? 'oxlint')),
      );
      inFlight.set(key, request);
      try {
        return { markers: await request };
      } catch (error) {
        return { unavailable: error instanceof Error ? error.message : String(error) };
      } finally {
        inFlight.delete(key);
      }
    },

    FIX: async (payload: LinterWorkerPayload) => {
      const result = await lint(payload, true);
      return {
        markers: diagnosticsToMarkers(result.diagnostics ?? [], result.engine ?? 'oxlint'),
        output: result.output,
        fixed: result.fixed ?? false,
      };
    },
  };
}
