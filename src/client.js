import {createClient} from '@tetris/front-server/lib/client'
import {getRoutes} from './routes/ui'
import defaultState from './default-state'

createClient(getRoutes, defaultState)
