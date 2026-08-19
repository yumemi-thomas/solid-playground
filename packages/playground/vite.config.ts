import { defineConfig, type Connect, type Plugin } from 'vite';
import { resolve } from 'node:path';
import solidPlugin from 'vite-plugin-solid';
import { runPlaygroundLint } from './lint-server';

const crossOriginIsolationHeaders = {
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

const repositoryRoot = resolve(import.meta.dirname, '../..');
interface IncomingLintRequest {
  code?: unknown;
  dialect?: unknown;
  fix?: unknown;
}

function readBody(request: Connect.IncomingMessage) {
  return new Promise<string>((resolveBody, reject) => {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => resolveBody(body));
    request.on('error', reject);
  });
}

function sendJson(response: Connect.ServerResponse, status: number, value: unknown) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(value));
}

function playgroundLint(): Plugin {
  return {
    name: 'solid-playground-lint',
    configureServer(server) {
      server.middlewares.use(lintMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(lintMiddleware());
    },
  };
}

function lintMiddleware(): Connect.NextHandleFunction {
  return async (request, response, next) => {
    if (request.method !== 'POST' || request.url !== '/__solid-playground/lint') {
      next();
      return;
    }
    try {
      const body = JSON.parse(await readBody(request)) as IncomingLintRequest;
      if (typeof body.code !== 'string') {
        sendJson(response, 400, { message: 'code must be a string' });
        return;
      }
      if (body.dialect !== 'solid-v1' && body.dialect !== 'solid-v2') {
        sendJson(response, 400, { message: 'dialect must be solid-v1 or solid-v2' });
        return;
      }
      const result = await runPlaygroundLint({ code: body.code, dialect: body.dialect, fix: body.fix === true });
      sendJson(response, 200, result);
    } catch (error) {
      sendJson(response, 400, { message: error instanceof Error ? error.message : String(error) });
    }
  };
}

export default defineConfig((env) => ({
  plugins: [solidPlugin(), playgroundLint()],
  resolve: { alias: { 'styled-system': resolve(repositoryRoot, 'styled-system') } },
  define: { 'process.env.NODE_DEBUG': 'false', ...(env.command === 'build' ? {} : { global: 'globalThis' }) },
  build: {
    target: 'esnext',
    rolldownOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  worker: { format: 'es', rolldownOptions: { output: { entryFileNames: 'assets/[name].js' } } },
  server: {
    proxy: {
      '/api': { target: 'http://localhost:8787', changeOrigin: true, rewrite: (path) => path.replace(/^\/api/, '') },
    },
    headers: crossOriginIsolationHeaders,
  },
  preview: { headers: crossOriginIsolationHeaders },
}));
