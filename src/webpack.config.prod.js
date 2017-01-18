const webpack = require('webpack')
const path = require('path')
const revision = require('git-rev-sync')

module.exports = ({envs, entry, commons, ignore}) => {
  return {
    devtool: 'source-map',
    context: __dirname,
    entry,
    output: {
      path: path.resolve(__dirname, '..', 'public', 'js'),
      filename: 'client.' + revision.short() + '.[name].js',
      publicPath: '/js/'
    },
    plugins: [
      envs,
      ignore,
      commons,
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        mangle: {
          screw_ie8: true,
          keep_fnames: true
        },
        compress: {
          screw_ie8: true
        },
        comments: false
      })
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
