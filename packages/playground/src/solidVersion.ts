export const SOLID_VERSION_OPTIONS = [
  { value: '2.0.0-rc.0', label: 'v2.0' },
  { value: '1.9.14', label: 'v1.9.14' },
] as const;

export type SolidVersion = (typeof SOLID_VERSION_OPTIONS)[number]['value'];

// Solid 2.0 is currently published as the rc.0 package; keep the UI label at
// the requested 2.0 level while pinning the actual package used by the REPL.
export const DEFAULT_SOLID_VERSION: SolidVersion = '2.0.0-rc.0';

/**
 * Selections this playground used to persist, mapped to the option that replaced
 * them. Without this a stored value that is no longer offered normalises to the
 * default, which would silently move someone from Solid 1.x to 2.0 on their next
 * visit.
 *
 * `1.9.4` was the label and the import-map pin, while the package the workspace
 * installs — and the version solid-checker's bundled 1.x contract is audited
 * against — is `1.9.14`.
 */
const REPLACED_SOLID_VERSIONS: Record<string, SolidVersion> = {
  '1.9.4': '1.9.14',
};

export function isSupportedSolidVersion(version: string | null | undefined): version is SolidVersion {
  return SOLID_VERSION_OPTIONS.some((option) => option.value === version);
}

export function normalizeSolidVersion(version: string | null | undefined): SolidVersion {
  if (isSupportedSolidVersion(version)) return version;
  if (version && version in REPLACED_SOLID_VERSIONS) return REPLACED_SOLID_VERSIONS[version];
  return DEFAULT_SOLID_VERSION;
}
