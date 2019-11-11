import winston from 'winston'

const transports = [
  new winston.transports.Console({
    level: 'debug',
    json: false,
    silent: Boolean(process.env.SILENT),
    colorize: true
  })
]

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
