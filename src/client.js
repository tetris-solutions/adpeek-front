require('@tetris/base-lib/intl')

const {createClient} = require('tetris-iso/client')
const {getRoutes} = require('./routes/ui')
const defaultState = require('./default-state').default
const {extend: extendBaseContext} = require('tetris-iso/base-context')

extendBaseContext('company', 'router')
createClient(getRoutes, defaultState)
