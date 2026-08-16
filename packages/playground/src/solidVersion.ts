export const SOLID_VERSION_OPTIONS = [
  { value: '2.0.0-rc.0', label: 'v2.0' },
  { value: '1.9.4', label: 'v1.9.4' },
] as const;

export type SolidVersion = (typeof SOLID_VERSION_OPTIONS)[number]['value'];

// Solid 2.0 is currently published as the rc.0 package; keep the UI label at
// the requested 2.0 level while pinning the actual package used by the REPL.
export const DEFAULT_SOLID_VERSION: SolidVersion = '2.0.0-rc.0';

export function isSupportedSolidVersion(version: string | null | undefined): version is SolidVersion {
  return SOLID_VERSION_OPTIONS.some((option) => option.value === version);
}

export function normalizeSolidVersion(version: string | null | undefined): SolidVersion {
  return isSupportedSolidVersion(version) ? version : DEFAULT_SOLID_VERSION;
}
