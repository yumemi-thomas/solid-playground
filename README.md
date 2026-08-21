<p>
  <img width="100%" src="https://assets.solidjs.com/banner?project=Playground&type=core" alt="Solid Playground">
</p>

# Solid-Checker Playground

This is the source code of the [solid playground](https://playground.solidjs.com) website.
Through it you can quickly discover what the Solid compiler will generate from your JSX templates and see Solid Checker diagnostics while editing.

This checkout keeps the upstream Solid Playground UI and replaces its in-browser
Solid linting with a Vite dev-server boundary. The boundary runs the published
`solid-checker@0.4.0-beta.1` native binary alongside Oxlint's own rules; it does
not load `eslint-plugin-solid` or `eslint-solid-standalone`.

## Scope: a linting playground

This fork exists to show what `solid-checker` reports, so the parts of the
upstream playground that serve `playground.solidjs.com`'s hosted-repl product are
gone: sign-in, the profile menu, the saved-repl list and its routes, publishing
and forking a repl, the shareable-link button, and Export to Zip. Nothing here
talks to `api.solidjs.com`, and there is no account to have. The single
scratchpad lives in `localStorage`, and a `#hash` in the URL is still read once
on load so an old share link opens its files.

What stays is what a linting playground needs: the editor with inline
diagnostics, the rule-example picker below, the Solid version switch, the
compiled-output and preview panes, editor scaling, and dark mode.

There are 4 compile-output modes available:

- DOM: The classic SPA generation mechanism
- SSR: The server side generation mechanism
- HYDRATION: The client side generation for hydration
- UNIVERSAL: The client side generation for universal (custom renderer)

## Getting up and running

This project is built using the [pnpm](https://pnpm.js.org/) package manager.

Once you got it up and running you can follow these steps the have a fully working environement:

```bash
# Clone the project
$ git clone https://github.com/solidjs/solid-playground

# cd into the project and install the dependencies
$ cd solid-playground && pnpm i

# Start the dev server
$ pnpm run dev

# Build the project
$ pnpm run build
```

The Solid version menu defaults to Solid `2.0` (currently pinned to the
published `2.0.0-rc.0` package) and only offers Solid `2.0` and `1.9.14` — the
1.x pin is the version the workspace installs and the version solid-checker's
bundled 1.x contract is audited against, so the preview runtime, the import map,
and the analysis all agree. The
linter request turns that selection into an explicit
`solid-v1` or `solid-v2` checker dialect.

### There is no in-browser fallback

The worker used to fall back to `solid-checker-wasm` in the browser when the
endpoint was unreachable. That fallback was removed, because it did not work and
could not be told apart from success.

`solid-checker`'s WASM API is a two-phase protocol: `planSync` returns the
TypeFacts v3 entity demands a TypeScript host has to answer, and only `checkSync`
with that completed table produces findings. The worker called `checkSync`
directly with an empty facts table, and the checker answered
`status: "certified"` with `functionsAnalyzed: 0` and zero findings — a clean
bill of health for code nothing had looked at. Every rule example rendered green
in the static-only deployment.

So a lint that cannot run now reports that, inline, instead of reporting nothing:

> Solid Checker did not run, so this file has NOT been analysed — the lint
> endpoint returned a non-JSON response (404). Findings are missing rather than
> absent.

`solid-checker-wasm` is still a dependency, and the Vite config still sends
`Cross-Origin-Opener-Policy: same-origin` and
`Cross-Origin-Embedder-Policy: require-corp` (the pattern used by the
[Oxc Playground](https://github.com/oxc-project/playground)), so a real
in-browser checker remains available to whoever implements the
`planSync` → TypeScript host → `checkSync` loop. Until then nothing imports it,
which also keeps its 7 MB `.wasm` out of the bundle.

## Rule examples

The header carries a **Rule examples** select listing every rule in the
`solid-checker` catalog for the currently selected Solid package — 26 rules
under Solid 2.0, 18 under Solid 1.x — grouped the way `docs/rules/README.md`
groups them and labelled with each rule's `SCxxxx` code.

Picking one loads a single `main.tsx` holding the code that reports the rule,
under a header comment naming the rule, its code, its severity, and what the
defect is. A **Resolve** button then appears beside the select: it swaps the same
file to the version written so the rule stays silent, and turns into
**Unresolve** to swap back. Both the selected rule and the variant on screen
survive a reload, and editing the file by hand drops the selection, since the
tab no longer holds the example as shipped. Switching the Solid version reloads
the equivalent rule from the other catalog (`no-direct-mutation` ⇄
`v1/no-direct-mutation`) rather than analysing one dialect's code under the
other.

Most examples export components instead of mounting one, so the preview pane
stays empty — the point of an example is the diagnostic in the editor, not a
running app.

The example files live in `packages/playground/examples/<dialect>/<case>/` as
real `.tsx` files, one `incorrect.tsx` and one `correct.tsx` per case study, and
their metadata lives in `packages/playground/src/examples/catalog.ts`. A rule
can have several cases when the interesting part is semantic proof rather than
syntax — for example, a local component named `Loading` is not Solid's actual
loading boundary. They are
excluded from the project's own `tsc`, `oxlint`, and `oxfmt` runs, and checked
by their own script instead:

```bash
pnpm run test:examples
```

The extra case studies are intentionally semantic: they hide the important
fact behind a type alias, a component value, a wrapper, or an expression whose
result is only known from TypeScript. That is where a syntax-only lint rule
would either miss the bug or mistake a same-named component for a framework
primitive. The examples include a fake `Loading`, a typed passthrough wrapper,
a `Promise` hidden behind `Promise.resolve`, a `Date` nested in a server
function interface, and a reactive list nested inside `Show`.

For every catalog entry that verifier composes the file exactly as the
playground does — header comment included — and then asserts that the incorrect
variant reports the entry's code and nothing else, that the correct variant
reports nothing at all, and that both typecheck against the dialect's real Solid
typings. So an example never claims a finding the checker does not actually
produce.

Where a defect genuinely belongs to more than one rule the entry declares the
extra codes in `alsoReports`, and the header comment says so. The beta.1
catalog deliberately merges overlapping ownership, async, and package-contract
findings so each example demonstrates one stable defect identity.

A handful of rules cannot be reproduced by a single file, because they need a
second package or a stale fact producer. Those are marked `standalone: false`,
labelled _documented only_ in the select, and their two variants explain the
rule and show the shape of the fix rather than faking a finding. Two entries
additionally draw a TypeScript error, because the only single-file shape that
triggers them is one `tsc` also rejects; they are marked `alsoTypeError` and say
so in the file.

## Lint latency

Three things keep editor feedback quick:

- **The two engines run concurrently.** A plain lint runs Oxlint's native rules
  and `solid-checker` over the same source at once — they only read it — so a
  request costs the slower of the two (~60 ms here) rather than their sum
  (~90 ms). A `--fix` run stays sequential, because Oxlint rewrites the file the
  checker then has to analyse.
- **TypeScript and the checker run concurrently in the editor.** The two
  diagnostic sources are independent, and awaiting the TypeScript service first
  used to hold the checker's findings behind type acquisition — by far the slower
  of the two on a cold editor.
- **Unchanged content is not re-linted.** Switching tabs, toggling the theme, and
  changing the Solid version all ask every open editor to relint; the worker
  replays the last few answers by content instead of re-crossing the network.

The `solid-checker` daemon is deliberately left off (`SOLID_CHECKER_DAEMON=0`).
It caches per project, each request gets a fresh temporary project, and the
~30 ms it could save is invisible behind the editor's 250 ms debounce — not worth
the risk of serving a stale analysis.

## Continuous integration

`.github/workflows/ci.yml` runs `lint`, `oxfmt --check`, the playground
typecheck, `test:lint-api`, `test:examples`, and `build`. The last two are the
ones that matter for this fork: they prove the serverless linter still runs on a
Linux runner, and that every rule example still reports what its catalog entry
claims — so a `solid-checker` upgrade that renames or retires a rule fails in CI
rather than in the deployed UI.

The repository includes a `vercel.json` configuration. Vercel builds the
workspace with `pnpm build`, serves `packages/playground/dist`, preserves the
SPA routes, and sends the cross-origin isolation headers retained for the editor
runtime. Linting remains server-bound; an unavailable endpoint is shown as an
explicit “not analysed” diagnostic.

## Credits / Technologies used

- [solid-js](https://github.com/solidjs/solid/): The view library
- [@babel/standalone](https://babeljs.io/docs/en/babel-standalone): The in-browser compiler. Solid compiler relies on babel
- [monaco](https://microsoft.github.io/monaco-editor/): The in-browser code editor. This is the code editor that powers VS Code
- [Windi CSS](https://windicss.org/): The CSS framework
- [vite](https://vitejs.dev/): The module bundler
- [workbox](https://developers.google.com/web/tools/workbox): The service worker generator
- [pnpm](https://pnpm.js.org/): The package manager
- [lz-string](https://github.com/pieroxy/lz-string): The string compression algorithm used to share REPL
