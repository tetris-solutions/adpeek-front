import {createClient} from 'tetris-iso/client'
import {getRoutes} from './routes/ui'
import defaultState from './default-state'
import {extend as extendBaseContext} from 'tetris-iso/base-context'
import loglevel from 'loglevel'
import Emitter from 'emmett'
import includes from 'lodash/includes'

extendBaseContext(
  'company',
  'router',
  'location',
  'isGuest',
  'isAdmin',
  'isLoggedIn',
  'cursors')

// @todo delete this
try {
  if (includes(window.location.search, 'enableCardStats')) {
    window.sessionStorage
      .setItem('cardStats', 'enabled')
  }
} catch (e) {
  loglevel.error(e)
}

const tree = createClient(getRoutes, defaultState)

window.event$ = new Emitter()

loglevel.setLevel(tree.get('debugMode') ? 'debug' : 'warn')

if (process.env.NODE_ENV !== 'production') {
  window.Perf = require('react-addons-perf')
}
