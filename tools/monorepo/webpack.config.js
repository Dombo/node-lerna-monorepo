const webpack = require("webpack");

module.exports = {
  mode: "none", // "none" for debugging
  entry: ["babel-polyfill", "./src/monorepo.js"],
  target: "node",
  output: {
    path: __dirname + "/lib",
    filename: "monorepo.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "env",
                {
                  targets: {
                    node: "8.10"
                  }
                }
              ]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }) // I use this to insert the shebang
  ]
};
