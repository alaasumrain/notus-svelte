import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import alias from '@rollup/plugin-alias';
import css from 'rollup-plugin-css-only';
import fs from 'fs';

const production = !process.env.ROLLUP_WATCH;

// configure aliases for absolute imports
const aliases = alias({
  resolve: ['.svelte', '.js'],
  entries: [
    { find: 'components', replacement: 'src/components' },
    { find: 'views', replacement: 'src/views' },
    { find: 'assets', replacement: 'src/assets' },
  ],
});

const indexTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />

    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon.png" />
    <link rel="stylesheet" href="/build/bundle.css" />
    <link
      rel="stylesheet"
      href="/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css"
    />
    <link rel="stylesheet" href="/assets/styles/tailwind.css" />
    <title>Notus Svelte</title>

    <script>
      if (process === undefined) {
        var process = { env: {<<process-env-status>>} };
      }
    </script>
    <script defer src="<<live-preview-link>>/build/bundle.js"></script>
  </head>

  <body class="text-blueGray-700 antialiased">
    <noscript>
      <strong>We're sorry but notus-svelte doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
  </body>
</html>
`;

if (production) {
  fs.writeFileSync(
    '../notus-svelte/public/index.html',
    indexTemplate
      .replace('<<process-env-status>>', 'PRODUCTION: true')
      .replace(/<<live-preview-link>>/g, '/notus-svelte')
  );
  fs.writeFileSync(
    '../notus-svelte/public/200.html',
    indexTemplate
      .replace('<<process-env-status>>', 'PRODUCTION: true')
      .replace(/<<live-preview-link>>/g, '/notus-svelte')
  );
  fs.writeFileSync(
    '../notus-svelte/public/404.html',
    indexTemplate
      .replace('<<process-env-status>>', 'PRODUCTION: true')
      .replace(/<<live-preview-link>>/g, '/notus-svelte')
  );
} else {
  fs.writeFileSync(
    '../notus-svelte/public/index.html',
    indexTemplate
      .replace('<<process-env-status>>', '')
      .replace(/<<live-preview-link>>/g, '')
  );
  fs.writeFileSync(
    '../notus-svelte/public/200.html',
    indexTemplate
      .replace('<<process-env-status>>', '')
      .replace(/<<live-preview-link>>/g, '')
  );
  fs.writeFileSync(
    '../notus-svelte/public/404.html',
    indexTemplate
      .replace('<<process-env-status>>', '')
      .replace(/<<live-preview-link>>/g, '')
  );
}

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn(
        'npm',
        ['run', 'start', '--', '--dev'],
        {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        }
      );

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: '../notus-svelte/public/build/bundle.js',
  },
  plugins: [
    svelte({
      compilerOptions: {
        dev: !production,
      },
      emitCss: true,
    }),

    // Process CSS files
    css({ output: 'bundle.css' }),

    resolve({
      browser: true,
      dedupe: ['svelte'],
      exportConditions: ['svelte'],
      extensions: ['.svelte', '.mjs', '.js', '.json', '.node']
    }),
    
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('../notus-svelte/public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),

    // for absolute imports
    aliases,
  ],
  watch: {
    clearScreen: false,
  },
};