#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const monorepo = require('commander');
const execa = require('execa');
const chokidar = require('chokidar');

monorepo
  .version('0.0.0')
  .option('-b, --bootstrap', 'Bootstrap dependencies for the dependents of the current working directory.')
  .option('-w, --watch', 'Start a watcher for the dependents of the current working directory.')
  .parse(process.argv);

const manifest = (dir = undefined) => require(`${dir ? dir : process.cwd()}/package.json`)

/*
* From the context of the process.cwd(), find the package manifest name & bootstrap it's dependencies via lerna
* */
const bootstrap = () => {
  try {
    const lernaArgs = `bootstrap --scope ${manifest().name} --include-filtered-dependencies`.split(' ');
    execa('lerna', lernaArgs, {stdio: 'inherit'});
  } catch (error) {
    throw new Error(`There was a problem trying to bootstrap the tree ${error}`);
  }
};

const buildDependencyTreeMeta = async () => {
  try {
    const lernaArgs = `ls --all --sort --toposort --json --scope ${manifest().name} --include-filtered-dependencies`.split(' ');
    const { stdout, stderr } = await execa('lerna', lernaArgs);
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(`There was an error building the dependency tree: ${error}`);
  }
};

const findParentPackageManifest = (changedFile) => {
  const startingPath = path.dirname(changedFile);

  const up = (node) => {
    let file = path.join(node, 'package.json');

    if (fs.existsSync(file)) {
      return path.dirname(file);
    }

    file = path.resolve(node, '..');

    return up(file)
  };

  return up(startingPath);
};

const pruneParentPackageTree = (tree) => tree.slice(1, tree.length - 1); // removes the leaf node & the tree root

const findParentPackages = async (name) => {
  const lernaArgs = `ls --all --toposort --json --scope ${name} --include-filtered-dependents`.split(' ');
  const { stdout } = await execa('lerna', lernaArgs);
  return JSON.parse(stdout);
};

const buildDependency = async (name) => {
  const lernaArgs = `run build --scope ${name}`.split(' ');
  await execa('lerna', lernaArgs, {stdio: 'inherit'});
};

/*
* From the context of a modified package currently under watch via watch()
*   Find the package manifest of the changed dependency
*   Build said dependency
*   Find the upstream dependencies of said dependency (sans the tree root & node just build)
*   Build them in order
* */
const buildDependencyChain = async (path) => {
  const changedPackageManifest = findParentPackageManifest(path);
  const changedPackageName = manifest(changedPackageManifest).name;
  await buildDependency(changedPackageName);
  const packageParents = await findParentPackages(changedPackageName);
  const buildWorthyParents = pruneParentPackageTree(packageParents);
  const buildOperations = buildWorthyParents.map(dependency => buildDependency(dependency.name));
  await Promise.all(buildOperations);
};

const spawnWatcher = async (paths) => {
  await console.log(`Would spawn a watcher over ${paths}`);
  const log = console.log.bind(console);

  // Initialize the watcher
  let watcher = chokidar.watch(paths, {
    ignored: [
      /(^|[\/\\])\../, // ignore dotfiles
      /node_modules/, // ignore node_modules
      /lib/ // ignore build output files
    ],
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: true // Helps minimising thrashing of watch events
  });

  // Add event listeners
  return watcher
    .on('add', path => {
      log(`File ${path} has been added`);
      buildDependencyChain(path);
    })
    .on('change', path => {
      log(`File ${path} has been changed`);
      buildDependencyChain(path);
    })
    .on('unlink', path => {
      log(`File ${path} has been removed`);
      buildDependencyChain(path);
    });
};

/*
* From the context of the process.cwd(), find the package manifest name & spawn a filesystem watcher for it's tree.
* */
const watch = async () => {
  try {
    const dependencyTreeMeta = await buildDependencyTreeMeta();
    const paths = dependencyTreeMeta // We only spawn watchers for the dependencies, it's expected you watch your app
      .slice(0, dependencyTreeMeta.length - 1)
      .map(dependency => dependency.location);
    spawnWatcher(paths)
  } catch (error) {
    throw new Error(`There was a problem trying to build the tree ${error}`);
  }
};

if (monorepo.bootstrap) bootstrap();
if (monorepo.watch) watch();
