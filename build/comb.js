'use strict';

const path = require('path');
const prettier = require('gulp-prettier');
const { src, dest, parallel } = require('gulp');

const prettierrc = require('../.prettierrc.json');
const { SRC_DIR, BUILD_DIR } = require('./paths');

function combSrc() {
  const SRC_PATTERS = [path.join(SRC_DIR, '*.ts'), path.join(SRC_DIR, '*.tsx')];
  return src(SRC_PATTERS).pipe(prettier(prettierrc)).pipe(dest(SRC_DIR));
}

function combBuild() {
  return src(path.join(BUILD_DIR, '*.js')).pipe(prettier(prettierrc)).pipe(dest(BUILD_DIR));
}

module.exports = parallel(combSrc, combBuild);
