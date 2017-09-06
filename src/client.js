import './babel-helpers'
import './polyfill'
import {createClient} from 'tetris-iso/client'
import {getRoutes} from './routes/ui'
import defaultState from './default-state'
import {extend as extendBaseContext} from 'tetris-iso/base-context'
import loglevel from 'loglevel'
import Emitter from 'emmett'

extendBaseContext(
  'company',
  'router',
  'location',
  'isGuest',
  'isAdmin',
  'isLoggedIn',
  'cursors')

window.event$ = new Emitter()

if (process.env.NODE_ENV !== 'production') {
  window.Perf = require('react-addons-perf')
}

const tree = createClient(getRoutes, defaultState)

loglevel.setLevel(tree.get('debugMode')
  ? 'debug'
  : 'warn')
