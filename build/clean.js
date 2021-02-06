'use-strict';

const rimraf = require('rimraf-then');
const mkdirp = require('mkdirp');

const { LIB_DIR } = require('./paths');

/** Clean task function - removes and recreates `lib` directory */
async function clean() {
  await rimraf(LIB_DIR);
  await mkdirp(LIB_DIR);
}

module.exports = clean;
