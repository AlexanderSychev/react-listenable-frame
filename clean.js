'use strict';

const del = require('del');
const path = require('path');

function main() {
    return new Promise((resolve) => {
        del([path.join(__dirname, 'dist', '**', '*')], resolve);
    });
}

main().then(
    (files) => {
        console.log(`Deleted files:\n\n${files.join('\n')}`);
        process.exit(0);
    },
    (err) => {
        console.error(err);
        process.exit(1);
    },
);
