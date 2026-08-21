import type { Dialect } from './types';

export interface ExampleEntry {
  /** Rule name exactly as the solid-checker catalog spells it. */
  rule: string;
  /** Optional case-study label included in the file header. */
  label?: string;
  /** Optional editor filename for an additional case of the same rule. */
  file?: string;
  /** Directory under `examples/<dialect>/` holding `incorrect.tsx` and `correct.tsx`. */
  dir: string;
  /** Stable diagnostic code the finding carries. */
  code: string;
  severity: 'error' | 'warning';
  /** Group heading in the picker. */
  category: string;
  /** One sentence describing the defect the incorrect file contains. */
  summary: string;
  /** Codes the incorrect file reports in addition to `code`. */
  alsoReports?: readonly string[];
  /** The rule needs a project shape a single playground file cannot reproduce. */
  standalone?: false;
  /** The incorrect file intentionally also contains a TypeScript error. */
  alsoTypeError?: true;
  /** Opt into checker preferences while this example is selected. */
  checkerPreset?: 'preferences';
}

const trackingV2 = 'Tracking & component semantics';
const jsxV2 = 'JSX correctness';
const writesV2 = 'Writes & actions';
const leafV2 = 'Leaf owners & cleanup';
const ownershipV2 = 'Ownership';
const asyncV2 = 'Async';
const directivesV2 = 'Directives';
const shapesV2 = 'API shapes';
const limitsV2 = 'Analysis limits (uncertifiable)';

export const SOLID_V2_EXAMPLES: readonly ExampleEntry[] = [
  {
    rule: 'strict-read-untracked',
    dir: 'strict-read-untracked',
    code: 'SC1001',
    severity: 'warning',
    category: trackingV2,
    summary: 'A prop is read at the top of a component body, so it is captured once and never updates.',
  },
  {
    rule: 'reactive-read-after-await',
    dir: 'reactive-read-after-await',
    code: 'SC1002',
    severity: 'error',
    category: trackingV2,
    summary: 'A reactive value is read after an await, where tracking has already ended.',
  },
  {
    rule: 'no-destructure',
    dir: 'no-destructure',
    code: 'SC1003',
    severity: 'error',
    category: trackingV2,
    summary: 'A reactive props object is destructured during setup, freezing its values.',
  },
  {
    rule: 'components-return-once',
    dir: 'components-return-once',
    code: 'SC1004',
    severity: 'error',
    category: trackingV2,
    summary: 'A component returns from reactive branches, so its structure is chosen once at setup.',
  },
  {
    rule: 'uncalled-accessor',
    dir: 'uncalled-accessor',
    code: 'SC1005',
    severity: 'warning',
    category: trackingV2,
    summary: 'A signal accessor is consumed as a value without being called.',
  },
  {
    rule: 'reactive-handler-frozen',
    dir: 'reactive-handler-frozen',
    code: 'SC1007',
    severity: 'warning',
    category: trackingV2,
    summary:
      'A reactive handler prop is read while the DOM listener is installed, so later handlers cannot replace it.',
  },
  {
    rule: 'reactive-write-in-owned-scope',
    dir: 'reactive-write-in-owned-scope',
    code: 'SC2001',
    severity: 'error',
    category: writesV2,
    summary: 'A signal is written from a children-capable reactive scope, which throws in dev.',
  },
  {
    rule: 'action-called-in-owned-scope',
    dir: 'action-called-in-owned-scope',
    code: 'SC2002',
    severity: 'error',
    category: writesV2,
    summary: 'An action is started during component setup instead of from an imperative boundary.',
  },
  {
    rule: 'no-direct-mutation',
    dir: 'no-direct-mutation',
    code: 'SC2003',
    severity: 'warning',
    category: writesV2,
    summary: 'A reactive value is mutated in place, so the write is dropped and nothing is notified.',
  },
  {
    rule: 'resolve-in-tracked-scope',
    dir: 'resolve-in-tracked-scope',
    code: 'SC2004',
    severity: 'error',
    category: writesV2,
    summary: 'resolve() is called while an observer is active, which throws in dev.',
  },
  {
    rule: 'leaf-owner-forbidden-call',
    dir: 'leaf-owner-forbidden-call',
    code: 'SC3001',
    severity: 'error',
    category: leafV2,
    summary: 'A leaf owner tries to register cleanup, create child work, or re-enter the flush cycle.',
  },
  {
    rule: 'missing-owner',
    dir: 'missing-owner',
    code: 'SC4001',
    severity: 'warning',
    category: ownershipV2,
    summary: 'An owner-requiring operation runs without an owner, so its subscriptions or teardown cannot be disposed.',
  },
  {
    rule: 'pending-async-unsuspendable-read',
    dir: 'pending-async-unsuspendable-read',
    code: 'SC5001',
    severity: 'error',
    category: asyncV2,
    summary: 'A pending async accessor is read in an untracked or leaf scope that cannot suspend and retry.',
  },
  {
    rule: 'async-outside-loading-boundary',
    dir: 'async-outside-loading-boundary',
    code: 'SC5003',
    severity: 'warning',
    category: asyncV2,
    summary: 'A tracked async read has no Loading boundary, so the page stays empty until it settles.',
  },
  {
    rule: 'async-outside-loading-boundary',
    label: 'async-outside-loading-boundary · impostor Loading component',
    file: 'impostor-loading.tsx',
    dir: 'async-outside-loading-boundary-impostor',
    code: 'SC5003',
    severity: 'warning',
    category: asyncV2,
    summary:
      'A local component is named Loading but is not Solid’s loading boundary, so the nested async read remains unprotected.',
  },
  {
    rule: 'async-outside-loading-boundary',
    label: 'async-outside-loading-boundary · passthrough wrapper',
    file: 'passthrough-wrapper.tsx',
    dir: 'async-outside-loading-boundary-passthrough',
    code: 'SC5003',
    severity: 'warning',
    category: asyncV2,
    summary:
      'A typed component forwards children without creating a Loading boundary, so the checker follows the call and reports the async read.',
  },
  {
    rule: 'primitive-in-directive-application',
    dir: 'primitive-in-directive-application',
    code: 'SC6001',
    severity: 'warning',
    category: directivesV2,
    summary: 'A directive application creates owner-attaching reactive work in an unowned callback.',
  },
  {
    rule: 'missing-effect-function',
    dir: 'missing-effect-function',
    code: 'SC7001',
    severity: 'error',
    category: shapesV2,
    summary: 'createEffect is called in the Solid 1.x single-callback shape instead of compute plus apply.',
  },
  {
    rule: 'sync-computation-received-async',
    dir: 'sync-computation-received-async',
    code: 'SC7002',
    severity: 'error',
    category: shapesV2,
    summary: 'A computation marked sync: true receives an async compute function.',
  },
  {
    rule: 'sync-computation-received-async',
    label: 'sync-computation-received-async · hidden Promise expression',
    file: 'hidden-promise.tsx',
    dir: 'sync-computation-received-async-promise-expression',
    code: 'SC7002',
    severity: 'error',
    category: shapesV2,
    summary: 'The computation has no async keyword, but its inferred Promise result still contradicts sync: true.',
  },
  {
    rule: 'reactive-read-after-await',
    label: 'reactive-read-after-await · named async computation',
    file: 'named-computation.tsx',
    dir: 'reactive-read-after-await-named-computation',
    code: 'SC1002',
    severity: 'error',
    category: trackingV2,
    summary:
      'A named async computation reads a signal only after await, so its dependency disappears even though the JSX is otherwise valid.',
  },
  {
    rule: 'http-response-after-flush',
    dir: 'http-response-after-flush',
    code: 'SC7005',
    severity: 'warning',
    category: shapesV2,
    summary: 'The HTTP response head is decided below a Loading boundary, after the shell may have flushed.',
  },
  {
    rule: 'server-function-module-directive',
    dir: 'server-function-module-directive',
    code: 'SC7006',
    severity: 'error',
    category: shapesV2,
    summary: 'Under a module-level "use server", a wrapped export is dropped from the client build.',
  },
  {
    rule: 'server-function-rich-argument',
    dir: 'server-function-rich-argument',
    code: 'SC7007',
    severity: 'error',
    category: shapesV2,
    summary: 'A server function receives an argument the plain transport cannot serialize.',
  },
  {
    rule: 'server-function-rich-argument',
    label: 'server-function-rich-argument · nested interface field',
    file: 'nested-interface.tsx',
    dir: 'server-function-rich-argument-nested-type',
    code: 'SC7007',
    severity: 'error',
    category: shapesV2,
    summary: 'A Date is hidden inside an interface, but type facts still prove the server transport will flatten it.',
  },
  {
    rule: 'package-contract-incomplete',
    dir: 'package-contract-incomplete',
    code: 'SC9005',
    severity: 'error',
    category: limitsV2,
    summary: 'A package boundary lacks complete, current, reviewed reactivity facts, so the checker refuses to guess.',
    standalone: false,
    alsoTypeError: true,
  },
  {
    rule: 'jsx-no-duplicate-props',
    dir: 'jsx-no-duplicate-props',
    code: 'SC8003',
    severity: 'error',
    category: jsxV2,
    summary: 'An intrinsic element receives multiple competing sources for its child content.',
  },
  {
    rule: 'prefer-for',
    dir: 'prefer-for',
    code: 'SC8014',
    severity: 'error',
    category: jsxV2,
    summary: 'A reactive array is rendered with map() instead of Solid 2.0 list control flow.',
    checkerPreset: 'preferences',
  },
  {
    rule: 'prefer-for',
    label: 'prefer-for · list nested inside Show',
    file: 'nested-show.tsx',
    dir: 'prefer-for-nested-show',
    code: 'SC8014',
    severity: 'error',
    category: jsxV2,
    summary:
      'A mapped reactive list is nested inside another JSX control-flow component, but still needs For for stable list identity.',
    checkerPreset: 'preferences',
  },
  {
    rule: 'components-return-once',
    label: 'components-return-once · typed Component value',
    file: 'typed-component.tsx',
    dir: 'components-return-once-typed-component',
    code: 'SC1004',
    severity: 'error',
    category: trackingV2,
    summary:
      'A reactive branch is hidden inside a value explicitly typed as Component, so compiler and type facts still identify the one-shot component body.',
  },
  {
    rule: 'prefer-show',
    dir: 'prefer-show',
    code: 'SC8015',
    severity: 'warning',
    category: jsxV2,
    summary: 'Reactive conditional JSX uses && or ?: instead of an explicit Show boundary.',
    checkerPreset: 'preferences',
  },
  {
    rule: 'reactive-source-uncaptured',
    dir: 'reactive-source-uncaptured',
    code: 'SC9011',
    severity: 'warning',
    category: limitsV2,
    summary: 'A reactive source crosses a package boundary whose behavior is undescribed.',
    standalone: false,
  },
  {
    rule: 'reactive-dispatch-unresolved',
    dir: 'reactive-dispatch-unresolved',
    code: 'SC9012',
    severity: 'warning',
    alsoReports: ['SC1001'],
    category: limitsV2,
    summary:
      'A call can reach implementations with different reactive behavior, so its execution cannot be pinned down.',
  },
];

const trackingV1 = 'Tracking & component semantics';
const writesV1 = 'Writes';
const ownershipV1 = 'Ownership';
const eslintV1 = 'JSX & control-flow preferences';
const limitsV1 = 'Analysis limits (uncertifiable)';

export const SOLID_V1_EXAMPLES: readonly ExampleEntry[] = [
  {
    rule: 'v1/strict-read-untracked',
    dir: 'strict-read-untracked',
    code: 'SC1001',
    severity: 'warning',
    category: trackingV1,
    summary: 'A prop is read at the top of a component body, so it is captured once and never updates.',
  },
  {
    rule: 'v1/reactive-read-after-await',
    dir: 'reactive-read-after-await',
    code: 'SC1002',
    severity: 'error',
    category: trackingV1,
    summary: 'A reactive value is read after an await, where tracking has already ended.',
  },
  {
    rule: 'v1/no-destructure',
    dir: 'no-destructure',
    code: 'SC1003',
    severity: 'error',
    category: trackingV1,
    summary: 'A reactive props object is destructured during setup, freezing its values.',
  },
  {
    rule: 'v1/components-return-once',
    dir: 'components-return-once',
    code: 'SC1004',
    severity: 'warning',
    category: trackingV1,
    summary: 'A component returns from reactive branches, so its structure is chosen once at setup.',
  },
  {
    rule: 'v1/reactive-write-in-owned-scope',
    dir: 'reactive-write-in-owned-scope',
    code: 'SC2001',
    severity: 'error',
    category: writesV1,
    summary: 'A signal is written from a tracked computation, feeding back into the graph that produced it.',
  },
  {
    rule: 'v1/missing-owner',
    dir: 'missing-owner',
    code: 'SC4001',
    severity: 'warning',
    category: ownershipV1,
    summary: 'An owner-requiring operation runs without an owner, so its subscriptions or teardown cannot be disposed.',
  },
  {
    rule: 'v1/missing-effect-function',
    dir: 'missing-effect-function',
    code: 'SC7001',
    severity: 'error',
    category: trackingV1,
    summary: 'createEffect receives a first argument that is not a function.',
  },
  {
    rule: 'v1/uncalled-accessor',
    dir: 'uncalled-accessor',
    code: 'SC1005',
    severity: 'warning',
    category: trackingV1,
    summary: 'A signal accessor is consumed as a value without being called.',
  },
  {
    rule: 'v1/reactive-handler-frozen',
    dir: 'reactive-handler-frozen',
    code: 'SC1007',
    severity: 'warning',
    alsoReports: ['SC1001'],
    category: trackingV1,
    summary:
      'A reactive handler prop is read while the DOM listener is installed, so later handlers cannot replace it.',
  },
  {
    rule: 'v1/no-direct-mutation',
    dir: 'no-direct-mutation',
    code: 'SC2003',
    severity: 'warning',
    category: writesV1,
    summary: 'A reactive value is mutated in place, so the write is dropped and nothing is notified.',
  },
  {
    rule: 'v1/reactive-source-uncaptured',
    dir: 'reactive-source-uncaptured',
    code: 'SC9011',
    severity: 'warning',
    category: limitsV1,
    summary: 'A reactive source crosses a package boundary whose behavior is undescribed.',
    standalone: false,
  },
  {
    rule: 'v1/reactive-dispatch-unresolved',
    dir: 'reactive-dispatch-unresolved',
    code: 'SC9012',
    severity: 'warning',
    alsoReports: ['SC1001'],
    category: limitsV1,
    summary:
      'A call can reach implementations with different reactive behavior, so its execution cannot be pinned down.',
  },
  {
    rule: 'v1/jsx-no-duplicate-props',
    dir: 'jsx-no-duplicate-props',
    code: 'SC8003',
    severity: 'error',
    category: eslintV1,
    summary: 'Differently spelled JSX props land in the same compiler slot, so one write is dead.',
  },
  {
    rule: 'v1/jsx-no-undef',
    dir: 'jsx-no-undef',
    code: 'SC8005',
    severity: 'error',
    category: eslintV1,
    summary: 'A use: directive names a binding that does not exist.',
  },
  {
    rule: 'v1/prefer-classlist',
    dir: 'prefer-classlist',
    code: 'SC8013',
    severity: 'warning',
    category: eslintV1,
    summary: 'A classnames-style object call rebuilds a class string instead of using classList.',
    checkerPreset: 'preferences',
  },
  {
    rule: 'v1/prefer-for',
    dir: 'prefer-for',
    code: 'SC8014',
    severity: 'error',
    category: eslintV1,
    summary: 'Array#map renders a reactive list directly as JSX children instead of using For.',
    checkerPreset: 'preferences',
  },
  {
    rule: 'v1/prefer-show',
    dir: 'prefer-show',
    code: 'SC8015',
    severity: 'warning',
    category: eslintV1,
    summary: 'Reactive conditional JSX uses && or ?: instead of an explicit Show boundary.',
    checkerPreset: 'preferences',
  },
  {
    rule: 'v1/package-contract-incomplete',
    dir: 'package-contract-incomplete',
    code: 'SC9005',
    severity: 'error',
    category: limitsV1,
    summary: 'A package boundary lacks complete, current, reviewed reactivity facts, so the checker refuses to guess.',
    standalone: false,
    alsoTypeError: true,
  },
];

export const EXAMPLES_BY_DIALECT: Record<Dialect, readonly ExampleEntry[]> = {
  'solid-v1': SOLID_V1_EXAMPLES,
  'solid-v2': SOLID_V2_EXAMPLES,
};
