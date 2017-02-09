'use strict'

const webpack = require('webpack')
const path = require('path')
const pkg = require('../package.json')

module.exports = function (config) {
  return {
    devtool: 'source-map',
    context: __dirname,
    entry: config.entry,
    output: {
      path: path.resolve(__dirname, '..', 'public', 'js'),
      filename: 'client.' + pkg.version + '.js',
      publicPath: '/js/'
    },
    plugins: [
      config.envs,
      config.ignore,
      new webpack.optimize.AggressiveMergingPlugin()
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
