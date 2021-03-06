import path from 'path'
import {createServer} from '@tetris/front-server/server'
import {setAppRoutes} from './routes/express'
import defaultState from './default-state'
import {getRoutes} from './routes/ui'
import HTML from './components/HTML'
import loglevel from 'loglevel'

loglevel.setLevel('error')

const config = {
  getWebpackConfig () {
    return require('./webpack.config')
  },
  defaultState,
  publicPath: path.resolve(__dirname, '..', 'public'),
  messagesFile: path.resolve(__dirname, 'messages', 'index.js'),
  port: 3003,
  setAppRoutes,
  getRoutes,
  HTML: HTML
}

createServer(config)
