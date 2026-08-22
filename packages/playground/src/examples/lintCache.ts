import type { ExampleVariant } from './composeExample';
import type { Dialect } from './types';

export const exampleLintCacheKey = (dialect: Dialect, directory: string, variant: ExampleVariant) =>
  `${dialect}\0${directory}\0${variant}`;
