'use strict'

const webpack = require('webpack')
const path = require('path')
const pkg = require('../package.json')
const BabelMinify = require('babel-minify-webpack-plugin')

module.exports = function (config) {
  return {
    devtool: 'cheap-module-source-map',
    context: __dirname,
    entry: config.entry,
    output: {
      path: path.resolve(__dirname, '..', 'public', 'js'),
      pathinfo: false,
      filename: 'client.' + pkg.version + '.js',
      publicPath: '/js/'
    },
    plugins: [
      config.envs,
      config.ignore,
      new webpack.optimize.AggressiveMergingPlugin(),
      new BabelMinify()
    ],
    module: {
      rules: [{
        test: /\.js?$/,
        exclude: /node_modules/,
        include: __dirname,
        loader: 'babel-loader'
      }]
    }
  }
}
