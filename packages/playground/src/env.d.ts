/// <reference types="vite/client" />

// The package ships declarations at `dist/types/index.d.ts` but its `exports`
// map does not expose them, so under `moduleResolution: bundler` TypeScript
// cannot reach them and the import falls back to `any` (TS7016). Declaring the
// surface this project uses restores the types without patching the dependency.
declare module '@amoutonbrady/lz-string' {
  export function compressToURL(input: string): string;
  export function decompressFromURL(input: string): string | null;
}
