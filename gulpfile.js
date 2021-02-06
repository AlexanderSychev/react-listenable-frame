'use strict';

const { series, parallel } = require('gulp');

const clean = require('./build/clean');
const comb = require('./build/comb');
const bundle = require('./build/bundle');

exports.clean = clean;
exports.comb = comb;
exports.bundle = bundle;

exports.default = series(
  parallel(clean, comb),
  bundle,
);
