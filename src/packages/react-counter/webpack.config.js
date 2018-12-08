// shared config (dev and prod)
const { resolve } = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
  mode: 'production',
  entry: './index.tsx',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  context: resolve(__dirname, './src'),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader', 'source-map-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'awesome-typescript-loader']
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } }
        ]
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'sass-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]',
          'image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false'
        ]
      }
    ]
  },
  plugins: [new CheckerPlugin()],
  externals: {
    react: 'commonjs react',
    'react-dom': 'commonjs react-dom'
  },
  output: {
    filename: 'index.js',
    path: resolve(__dirname, './lib'),
    libraryTarget: 'commonjs'
  }
};
