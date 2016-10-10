import {createClient} from 'tetris-iso/client'
import {getRoutes} from './routes/ui'
import defaultState from './default-state'

createClient(getRoutes, defaultState)
