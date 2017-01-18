const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = ({entry, commons, envs, ignore}) => {
  const plugins = [
    envs,
    ignore,
    commons
  ]

  if (process.env.banal) {
    plugins.push(new BundleAnalyzerPlugin())
  }

  return {
    devtool: 'eval',
    context: __dirname,
    entry,
    output: {
      path: path.resolve(__dirname, '..', 'public', 'js'),
      filename: 'client.[name].js',
      publicPath: '/js/'
    },
    plugins: plugins,
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
