'use-strict';

const path = require('path');
const rimraf = require('rimraf-then');
const mkdirp = require('mkdirp');

const { LIB_DIR, SHOW_CASE_DIR } = require('./paths');

/** Clean task function - removes and recreates `lib` directory */
async function clean() {
  await Promise.all([
    rimraf(LIB_DIR),
    rimraf(path.join(SHOW_CASE_DIR, '*.js')),
    rimraf(path.join(SHOW_CASE_DIR, '*.js.map')),
  ]);
  await mkdirp(LIB_DIR);
}

module.exports = clean;
