var webpack = require('webpack')
var path = require('path')
var passEnv = require('./functions/pass-env')
var revision = require('git-rev-sync')

module.exports = {
  devtool: 'source-map',
  context: __dirname,
  entry: [
    path.resolve(__dirname, 'client.js')
  ],
  output: {
    path: path.resolve(__dirname, '..', 'public', 'js'),
    filename: 'client.' + revision.short() + '.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': passEnv()
    }),
    new webpack.optimize.UglifyJsPlugin({})
  ],
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      include: __dirname,
      loader: 'babel'
    }]
  }
}
