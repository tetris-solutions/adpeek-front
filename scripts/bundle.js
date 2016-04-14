#!/usr/bin/env node

var $ = require('shelljs')
var path = require('path')
var env = process.env.NODE_ENV || 'production'

$.cd(path.resolve(__dirname, '..', 'src'))
$.exec(`NODE_ENV=${env} BUILD_PROD=true ../node_modules/.bin/webpack`)
