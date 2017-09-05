require('./babel-helpers')
require('./polyfill')

const path = require('path')

require('dotenv').config({
  path: path.resolve(__dirname, '..', '.env')
})

require('@tetris/base-lib/intl')
require('./server')
