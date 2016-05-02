import winston from 'winston'
import {Logstash} from 'winston-logstash'
import os from 'os'

const transports = [
  new winston.transports.Console({
    level: 'debug',
    json: false,
    silent: Boolean(process.env.SILENT),
    colorize: true
  })
]

if (!process.env.SILENT) {
  transports.push(new Logstash({
    level: 'debug',
    port: 28777,
    node_name: 'adpeek-front@' + os.hostname(),
    host: process.env.LOGSTASH_HOST
  }))
}

export const logger = new winston.Logger({
  transports,
  levels: winston.config.syslog.levels,
  exitOnError: false
})

export const httpLogStream = {
  write (message, _encoding) {
    logger.debug(message, {category: 'http-request'})
  }
}

logger.emitErrs = false

export default logger
