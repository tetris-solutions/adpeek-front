const {createClient} = require('tetris-iso/client')
const {getRoutes} = require('./routes/ui')
const defaultState = require('./default-state').default
const {extend: extendBaseContext} = require('tetris-iso/base-context')

extendBaseContext('company', 'router', 'location')
createClient(getRoutes, defaultState)

if (process.env.NODE_ENV !== 'production') {
  require('global').Perf = require('react-addons-perf')
}
