#!/usr/bin/env node

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

const buildDependency = (path, name) => {
  const lernaArgs = `exec --scope ${name} -- npm run build`.split(' ');
  execa('lerna', lernaArgs, {stdio: 'inherit'});
};

const spawnWatcher = async (paths) => {
  await console.log(`Would spawn a watcher over ${paths}`);
  const log = console.log.bind(console);

  // Initialize the watcher
  let watcher = chokidar.watch(paths, {
    ignored: [
      /(^|[\/\\])\../, // ignore dotfiles
      /node_modules/ // ignore node_modules
    ],
    persistent: true,
    ignoreInitial: true,
    // awaitWriteFinish: true // Could be worthwhile if we have perf issues
  });

  // Add event listeners
  return watcher
    .on('add', path => {
      log(`File ${path} has been added`);
    })
    .on('change', path => {
      log(`File ${path} has been changed`);
    })
    .on('unlink', path => {
      log(`File ${path} has been removed`);
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
