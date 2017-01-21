#!/usr/bin/env node

var $ = require('shelljs')
var path = require('path')
var env = process.env.NODE_ENV || 'production'

$.cd(path.resolve(__dirname, '..', 'src'))

const cmd = `NODE_ENV=${env} BUILD_PROD=true ../node_modules/.bin/webpack --optimize-minimize`

if (process.env.banal) {
  $.exec(`${cmd} --profile --json > ../bundle-stats.json`)
  $.exec(`../node_modules/.bin/webpack-bundle-analyzer ../bundle-stats.json`)
} else {
  $.exec(`${cmd} --progress`)
}

