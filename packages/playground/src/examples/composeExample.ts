import type { ExampleEntry } from './catalog';

export type ExampleVariant = 'incorrect' | 'correct';

export const OTHER_VARIANT: Record<ExampleVariant, ExampleVariant> = {
  incorrect: 'correct',
  correct: 'incorrect',
};

/** The header label of the button that swaps to the other variant. */
export const VARIANT_ACTION: Record<ExampleVariant, string> = {
  incorrect: 'Resolve',
  correct: 'Unresolve',
};

function orientation(entry: ExampleEntry, variant: ExampleVariant): string {
  if (entry.standalone === false) {
    return variant === 'incorrect'
      ? `// A single file cannot reproduce this finding — this one explains why.\n// Press "${VARIANT_ACTION.incorrect}" in the header for the shape the fix takes.`
      : `// This is the shape the fix takes, and it certifies.\n// Press "${VARIANT_ACTION.correct}" in the header for why one file cannot\n// reproduce the finding.`;
  }
  return variant === 'incorrect'
    ? `// This is the code the rule reports. Press "${VARIANT_ACTION.incorrect}" in the header\n// to swap in the version that reports nothing.`
    : `// This is the fixed version: the rule stays silent. Press "${VARIANT_ACTION.correct}"\n// in the header to go back to the code that reports it.`;
}

/**
 * The single file an example loads: a header naming the rule, then the variant's
 * own source. `scripts/verify-examples.mjs` lints exactly this composition, so
 * the header can never introduce a finding of its own.
 */
export function composeExample(entry: ExampleEntry, variant: ExampleVariant, source: string): string {
  const lines = [`// ${entry.code} · ${entry.rule} · ${entry.severity}`, '//', `// ${entry.summary}`];

  if (entry.label) lines.push('//', `// Case: ${entry.label}`);

  if (variant === 'incorrect' && entry.alsoReports?.length) {
    lines.push(
      '//',
      `// The same code also reports ${entry.alsoReports.join(', ')}: it contains more than`,
      '// one defect, and each rule owns its own.',
    );
  }
  if (variant === 'incorrect' && entry.alsoTypeError) {
    lines.push('//', '// TypeScript flags this too; the comment below says why.');
  }

  lines.push('//', orientation(entry, variant), '');
  return `${lines.join('\n')}\n${source}`;
}
