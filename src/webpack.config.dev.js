var webpack = require('webpack')
var path = require('path')
var passEnv = require('./functions/pass-env')

module.exports = {
  devtool: 'eval',
  context: __dirname,
  entry: [
    'webpack-hot-middleware/client',
    path.resolve(__dirname, 'client.js')
  ],
  output: {
    path: path.resolve(__dirname, '..', 'public', 'js'),
    filename: 'client.js',
    publicPath: '/js/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': passEnv()
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      include: __dirname,
      loader: 'babel',
      query: {
        plugins: [
          ['react-transform', {
            transforms: [
              {
                transform: 'react-transform-hmr',
                imports: ['react'],
                locals: ['module']
              }, {
                transform: 'react-transform-catch-errors',
                imports: ['react', 'redbox-react']
              }
            ]
          }]
        ]
      }
    }]
  }
}
