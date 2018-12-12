## Getting Started

### Purpose

An example of managing a monorepo with lerna.

The monorepo utility introduced in `~/tool/monorepo/monorepo.js` provides a watcher utility.
This will watch for changes in any lerna managed dependencies of your current project (in this case `~/src/web`).
When a change is recorded, the watcher will start at the first leaf of the dependency chain and walk up, running the build command as it goes.
This effectively allows you to develop on multiple distinct packages in a monorepo without having to adopt a publish -> pull workflow as is common.

### Developer Environment

Docker running Node 10 on Debian 8

#### Tools Installed

- Lerna
- monorepo utility for bootstrapping and watching the repo during development 

#### Setup dev enviroment

`./docker/launch-container.sh` will setup the container and ssh you in.

#### Folder Structure

```
├── README.md
├── docker
├── lerna.json
├── package.json
├── src
│   ├── packages
│   │   ├── logos
│   │   ├── math
│   │   ├── react-counter
│   │   └── react-utils
│   └── web
```

#### Dependency Graph

```
               +------+
               | Web  |
               +------+
                  |
                  |
           +---------------+
           | react-counter |
           +---------------+
             |         |
             |         |
        +------+    +-------------+
        | math |    | react-utils |
        +------+    +-------------+
             |
             |
        +-------+
        | logos |
        +-------+


```

### Assumptions

Each package will have the following commands.

- `build`

Each package will output it's build artefacts to a `lib` directory relative to the package root.


### Credits

@tomjrob for the brainwave

@davidhooper for the testing ground