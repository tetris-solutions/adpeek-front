'use strict'

const includes = require('lodash/includes')
const webpack = require('webpack')
const path = require('path')
const dotenv = require('dotenv')
const InlineEnv = require('inline-environment-variables-webpack-plugin')

dotenv.config({
  path: path.resolve(__dirname, '..', '.env')
})

const envs = new InlineEnv()
const entry = path.resolve(__dirname, 'client.js')
const ignore = new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)

const commons = new webpack.optimize.CommonsChunkPlugin({
  // names: ['vendor', 'manifest'],
  name: 'vendor',
  minChunks: module => {
    return includes(module.resource, '/node_modules/')
  }
})

module.exports = process.env.DEV_SERVER === 'true'
  ? require('./webpack.config.dev')({entry, commons, ignore, envs})
  : require('./webpack.config.prod')({entry, commons, ignore, envs})
