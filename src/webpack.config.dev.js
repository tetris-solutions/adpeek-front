'use strict'

const path = require('path')

module.exports = function (config) {
  return {
    devtool: 'cheap-eval-source-map',
    context: __dirname,
    entry: config.entry,
    output: {
      path: path.resolve(__dirname, '..', 'public', 'js'),
      pathinfo: true,
      filename: 'client.js',
      publicPath: '/js/'
    },
    plugins: [
      config.envs,
      config.ignore
    ],
    module: {
      rules: [{
        test: /\.js?$/,
        exclude: /node_modules/,
        include: __dirname,
        loader: 'babel-loader'
        // query: {
        //   plugins: [
        //     ['react-transform', {
        //       transforms: [
        //         {
        //           transform: 'react-transform-hmr',
        //           imports: ['react'],
        //           locals: ['module']
        //         }, {
        //           transform: 'react-transform-catch-errors',
        //           imports: ['react', 'redbox-react']
        //         }
        //       ]
        //     }]
        //   ]
        // }
      }]
    }
  }
}
