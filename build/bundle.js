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

/**
 * Library bundle creation task function
 * @param {string} format Format of bundle
 * @param {string} file Name of bundle fine
 * @param {boolean} sourcemap Should generate source map
 * @returns {Promise<void>}
 */
async function lib(format, file, sourcemap) {
  const plugins = [];
  const globals = {};

  if (format === 'iife') {
    plugins.push(
      pluginTypeScript({
        target: 'ES5',
        lib: ['DOM', 'ES2015'],
      }),
    );
    plugins.push(terser({ format: { comments: false } }));
    globals.react = 'React';
  } else {
    plugins.push(pluginTypeScript());
  }

  const bundle = await rollup({
    plugins,
    input: path.join(SRC_DIR, 'react-listenable-frame.tsx'),
    external: ['react'],
  });
  await bundle.write({
    format,
    globals,
    sourcemap,
    exports: 'default',
    name: format === 'iife' ? 'ReactListenableFrame' : undefined,
    file: path.join(LIB_DIR, file),
  });
}

/** Build CommonJS bundle (to use by "Node.JS" or "browserify") */
function cjs() {
  return lib('cjs', 'react-listenable-frame.js', false);
}

/**
 * Build ES6 Module library bundle (to use by "rollup" or "webpack" bundlers)
 */
function mjs() {
  return lib('es', 'react-listenable-frame.mjs', false);
}

/** Build browser bundle (to include by `<script>` tag) */
async function browser() {
  return lib('iife', 'react-listenable-frame.min.js', true);
}

module.exports = parallel(cjs, mjs, browser);
