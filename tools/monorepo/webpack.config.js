const webpack = require('webpack');

module.exports = {
  "mode": "production",
  "entry": "./src/monorepo.js",
  "target": "node",
  "output": {
    "path": __dirname+'/lib',
    "filename": "monorepo.js"
  },
  "module": {
    "rules": [
      {
        "test": /\.js$/,
        "exclude": /node_modules/,
        "use": {
          "loader": "babel-loader",
          "options": {
            "presets": [
              "env"
            ]
          }
        }
      }
    ]
  },
  "plugins": [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }) // I use this to insert the shebang
  ]
};