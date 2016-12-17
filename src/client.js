const {createClient} = require('tetris-iso/client')
const {getRoutes} = require('./routes/ui')
const defaultState = require('./default-state').default
const {extend: extendBaseContext} = require('tetris-iso/base-context')

extendBaseContext('company', 'router', 'location', 'isGuest', 'isAdmin', 'isLoggedIn')
createClient(getRoutes, defaultState)

const Emitter = require('emmett')
window.event$ = new Emitter()

if (process.env.NODE_ENV !== 'production') {
  window.Perf = require('react-addons-perf')
}
