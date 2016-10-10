import path from 'path'
import {createServer} from 'tetris-iso/server'
import {setAppRoutes} from './routes/express'
import defaultState from './default-state'
import {getRoutes} from './routes/ui'
import HTML from './components/HTML'

const config = {
  getWebpackConfig () {
    return require('./webpack.config')
  },
  defaultState,
  publicPath: path.resolve(__dirname, '..', 'public'),
  messagesFile: path.resolve(__dirname, 'messages', 'index.js'),
  port: 3001,
  setAppRoutes,
  getRoutes,
  HTML: HTML
}

createServer(config)
