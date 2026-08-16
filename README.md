<p>
  <img width="100%" src="https://assets.solidjs.com/banner?project=Playground&type=core" alt="Solid Playground">
</p>

# Solid Playground with Solid Checker

This is the source code of the [solid playground](https://playground.solidjs.com) website.
Through it you can quickly discover what the Solid compiler will generate from your JSX templates and see Solid Checker diagnostics while editing.

This checkout keeps the upstream Solid Playground UI and replaces its in-browser
Solid linting with a Vite dev-server boundary. The boundary runs the published
`solid-checker@0.3.1-beta.2` adapter through ESLint or Oxlint; it does not load
`eslint-plugin-solid` or `eslint-solid-standalone`. Oxlint is the preferred mode.

There are 3 modes available:

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

# Start the dev server (preferred Oxlint adapter)
$ pnpm run dev

# Optional: run the same checker adapter through ESLint
$ SOLID_PLAYGROUND_LINTER=eslint pnpm run dev

# Build the project
$ pnpm run build
```

The Solid version menu defaults to Solid `2.0` (currently pinned to the
published `2.0.0-rc.0` package) and only offers Solid `2.0` and `1.9.4`. The
linter request turns that selection into an explicit
`solid-v1` or `solid-v2` checker dialect.
The browser worker also bundles `solid-checker-wasm@0.3.1-beta.2` as a fallback.
Because the WASM runtime uses shared memory, the Vite config sends
`Cross-Origin-Opener-Policy: same-origin` and
`Cross-Origin-Embedder-Policy: require-corp` headers, following the pattern used
by the [Oxc Playground](https://github.com/oxc-project/playground).

The repository includes a `vercel.json` configuration. Vercel builds the
workspace with `pnpm build`, serves `packages/playground/dist`, preserves the
SPA routes, and sends the cross-origin isolation headers required by the browser
WASM fallback. The static deployment intentionally falls back from the local
Vite lint endpoint to `solid-checker-wasm` in the browser.

## Credits / Technologies used

- [solid-js](https://github.com/solidjs/solid/): The view library
- [@babel/standalone](https://babeljs.io/docs/en/babel-standalone): The in-browser compiler. Solid compiler relies on babel
- [monaco](https://microsoft.github.io/monaco-editor/): The in-browser code editor. This is the code editor that powers VS Code
- [Windi CSS](https://windicss.org/): The CSS framework
- [vite](https://vitejs.dev/): The module bundler
- [workbox](https://developers.google.com/web/tools/workbox): The service worker generator
- [pnpm](https://pnpm.js.org/): The package manager
- [lz-string](https://github.com/pieroxy/lz-string): The string compression algorithm used to share REPL
