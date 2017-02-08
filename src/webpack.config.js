'use strict'

const includes = require('lodash/includes')
const webpack = require('webpack')
const path = require('path')
const dotenv = require('dotenv')
const passEnv = require('./functions/pass-env')

dotenv.config({
  path: path.resolve(__dirname, '..', '.env'),
  silent: true
})

const entry = path.resolve(__dirname, 'client.js')

const envs = new webpack.DefinePlugin({
  'process.env': passEnv()
})
const ignore = new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)

const commons = new webpack.optimize.CommonsChunkPlugin({
  // names: ['vendor', 'manifest'],
  name: 'vendor',
  minChunks: module => {
    return includes(module.resource, '/node_modules/')
  }
})

module.exports = process.env.DEV_SERVER
  ? require('./webpack.config.dev')({entry, commons, ignore, envs})
  : require('./webpack.config.prod')({entry, commons, ignore, envs})
