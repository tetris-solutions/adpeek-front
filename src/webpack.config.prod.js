'use strict'

const webpack = require('webpack')
const path = require('path')
const revision = require('git-rev-sync')

module.exports = function (config) {
  return {
    devtool: 'source-map',
    context: __dirname,
    entry: config.entry,
    output: {
      path: path.resolve(__dirname, '..', 'public', 'js'),
      filename: 'client.' + revision.short() + '.js',
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
