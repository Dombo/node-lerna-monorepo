## Getting Started

### Developer Enviornment

Docker running Node 10 on Debian 8

#### Tools Installed

- Bazel
- Lerna
- pkg-install script for scoping lerna commands to the current pkg

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
│   │   ├── math
│   │   └── react-counter
│   └── web
```

### Building Packages

Each package will have the following commands.

- `build`
- `clean`
- `clean-build`
