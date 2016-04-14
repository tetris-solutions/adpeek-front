import path from 'path'
import {createServer} from '@tetris/front-server/lib/server'
import {setAppRoutes} from './routes/express'
import {httpLogStream} from './logger'
import defaultState from './default-state'
import messages from './messages'
import {getRoutes} from './routes/ui'
import HTML from './components/HTML'

const config = {
  getWebpackConfig () {
    return require('./webpack.config')
  },
  httpLogStream,
  defaultState,
  publicPath: path.resolve(__dirname, '..', 'public'),
  messages,
  port: 3001,
  setAppRoutes,
  getRoutes,
  HTML: HTML
}

createServer(config)
