'use strict';

const path = require('path');
const eslint = require('gulp-eslint7');
const { src } = require('gulp');

const { SRC_DIR } = require('./paths');

function lint() {
  const PATTERNS = [path.join(SRC_DIR, '*.ts'), path.join(SRC_DIR, '*.tsx')];
  return src(PATTERNS)
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

module.exports = lint;
