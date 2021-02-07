'use strict';

const { series, parallel } = require('gulp');

const clean = require('./build/clean');
const comb = require('./build/comb');
const lint = require('./build/lint');
const bundle = require('./build/bundle');

exports.clean = clean;
exports.comb = comb;
exports.lint = lint;
exports.bundle = bundle;

exports.default = series(
  parallel(clean, comb),
  lint,
  bundle,
);
