import {createClient} from 'tetris-iso/client'
import {getRoutes} from './routes/ui'
import defaultState from './default-state'

require('tetris-iso/base-context')
  .extend('company', 'router')

createClient(getRoutes, defaultState)
