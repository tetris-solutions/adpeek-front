const {createClient} = require('tetris-iso/client')
const {getRoutes} = require('./routes/ui')
const defaultState = require('./default-state').default
const {extend: extendBaseContext} = require('tetris-iso/base-context')
const loglevel = require('loglevel')

extendBaseContext('company', 'router', 'location', 'isGuest', 'isAdmin', 'isLoggedIn')
const tree = createClient(getRoutes, defaultState)

const Emitter = require('emmett')
window.event$ = new Emitter()

loglevel.setLevel(tree.get('debugMode') ? 'debug' : 'warn')

if (process.env.NODE_ENV !== 'production') {
  window.Perf = require('react-addons-perf')
}
