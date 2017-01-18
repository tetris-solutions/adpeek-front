const path = require('path')
const revision = require('git-rev-sync')

module.exports = ({envs, entry, commons, ignore}) => {
  return {
    devtool: 'source-map',
    context: __dirname,
    entry,
    output: {
      path: path.resolve(__dirname, '..', 'public', 'js'),
      filename: 'client.' + revision.short() + '.js',
      publicPath: '/js/'
    },
    plugins: [
      envs,
      ignore
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
