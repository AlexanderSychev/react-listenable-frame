// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Library building tasks' functions
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

'use strict';

const path = require('path');
const pluginTypeScript = require('@rollup/plugin-typescript');
const { parallel } = require('gulp');
const { rollup } = require('rollup');
const { terser } = require('rollup-plugin-terser');

const { SRC_DIR, LIB_DIR, SHOW_CASE_DIR } = require('./paths');

/** Build unminified library bundle (for development) */
async function lib() {
  const bundle = await rollup({
    input: path.join(SRC_DIR, 'react-listenable-frame.tsx'),
    external: ['react'],
    plugins: [pluginTypeScript()],
  });
  await bundle.write({
    file: path.join(LIB_DIR, 'react-listenable-frame.js'),
    format: 'umd',
    name: 'ReactListenableFrame',
    globals: {
      react: 'React',
    },
  });
}

/** Build minified library bundle (for production) */
async function min() {
  const bundle = await rollup({
    input: path.join(SRC_DIR, 'react-listenable-frame.tsx'),
    external: ['react'],
    plugins: [pluginTypeScript(), terser({ format: { comments: false } })],
  });
  await bundle.write({
    file: path.join(LIB_DIR, 'react-listenable-frame.min.js'),
    format: 'umd',
    name: 'ReactListenableFrame',
    sourcemap: 'hidden',
    globals: {
      react: 'React',
    },
  });
}

/** Build minified frame script */
async function frame() {
  const bundle = await rollup({
    input: path.join(SRC_DIR, 'frame.ts'),
    plugins: [pluginTypeScript(), terser({ format: { comments: false } })],
  });
  await bundle.write({
    file: path.join(SHOW_CASE_DIR, 'frame.js'),
    sourcemap: 'hidden',
    format: 'iife',
  });
}

/** Build minified showcase script */
async function showCase() {
  const bundle = await rollup({
    input: path.join(SRC_DIR, 'show-case.tsx'),
    external: ['react', 'react-dom'],
    plugins: [pluginTypeScript(), terser({ format: { comments: false } })],
  });
  await bundle.write({
    file: path.join(SHOW_CASE_DIR, 'show-case.js'),
    sourcemap: 'hidden',
    format: 'iife',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  });
}

module.exports = parallel(lib, min, frame, showCase);
