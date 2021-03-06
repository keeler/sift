const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const devConfig = require('./webpack.dev.config');
const prodConfig = require('./webpack.prod.config');

function copy(path) {
  return {
    from: path,
    to: path,
  };
}

function multipleCopy(...paths) {
  return paths.map(copy);
}

const config = {
  context: path.resolve(__dirname, './extension'),
  entry: {
    'background': './background.js',
    'content_scripts/getItem': './content_scripts/getItem.js'
  },
  output: {
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
  },
  resolve: {
    extensions: ['.js'],
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  optimization: {},
  module: {
    rules: [],
  },
  plugins: [
    new CopyWebpackPlugin(
      multipleCopy('manifest.json')
        .concat([
          {from: 'icons/*'},
        ])
    ),
  ],
};

module.exports = (env, argv) => {
  let envConfig;

  if (argv.mode === 'development') {
    envConfig = devConfig;
  }

  if (argv.mode === 'production') {
    envConfig = prodConfig;
  }

  return merge(config, envConfig);
};