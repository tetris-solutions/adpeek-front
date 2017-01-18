// esse arquivo é escrito em commonjs e js legado
// pra que o usuário possa rodar `webpack` normalmente da pasta src

const webpack = require('webpack')
const path = require('path')
const dotenv = require('dotenv')
const passEnv = require('./functions/pass-env')

dotenv.config({
  path: path.resolve(__dirname, '..', '.env'),
  silent: true
})

const entry = {
  main: path.resolve(__dirname, 'client.js'),
  vendor: [
    'moment',
    'react',
    'react-dom',
    'baobab',
    'baobab-react/higher-order',
    'react-router'
  ]
}

const envs = new webpack.DefinePlugin({
  'process.env': passEnv()
})
const ignore = new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
const commons = new webpack.optimize.CommonsChunkPlugin({
  names: ['vendor', 'manifest']
})

module.exports = !process.env.BUILD_PROD
  ? require('./webpack.config.dev')({entry, commons, ignore, envs})
  : require('./webpack.config.prod')({entry, commons, ignore, envs})
