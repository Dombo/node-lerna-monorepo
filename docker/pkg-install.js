#!/usr/bin/env node

/**
 * Manages adding packages from NPM and internally using Lerna.
 * Usage:
 *  pkg-install - runs lerna bootstrap for the current package
 *  pkg-install package-name, ...package-names - runs lerna add for the package(s).
 */

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const packageFile = path.resolve(process.cwd(), 'package.json');
if (fs.existsSync(packageFile)) {
  const pkg = require(packageFile);
  let command = '';
  if (process.argv[2] === undefined) {
    command = pkg.name
      ? `lerna bootstrap --scope=${pkg.name}`
      : `lerna bootstrap`;
  } else {
    let pkgs = '';
    process.argv
      .slice(2, process.argv.length)
      .forEach(p => (pkgs = pkgs.concat(p, ' ')));
    command = pkg.name
      ? `lerna add ${pkgs} --scope=${pkg.name}`
      : `lerna add  ${pkgs}`;
  }
  const child = cp.exec(command);
  process.stdout.write(`${command} \n`);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
} else {
  process.stderr.write('Cannot find package.json');
}
