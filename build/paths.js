// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Absoule paths to directories and files
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

'use strict';

const path = require('path');

/** Build scripts directory */
const BUILD_DIR = __dirname;

/** Project root directory */
const ROOT_DIR = path.resolve(BUILD_DIR, '../');

/** All source code directory */
const SRC_DIR = path.join(ROOT_DIR, 'src');

/** Compiled library code directory */
const LIB_DIR = path.join(ROOT_DIR, 'lib');

module.exports = {
  BUILD_DIR,
  ROOT_DIR,
  SRC_DIR,
  LIB_DIR,
};
