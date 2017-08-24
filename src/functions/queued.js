import log from 'loglevel'
import delay from 'delay'

export const queued = (fn, t = 300) => {
  let promise = Promise.resolve()

  return (...args) => {
    promise = promise
      .catch(err => {
        log.error(err)
      })
      .then(delay(t))
      .then(() => fn(...args))

    return promise
  }
}
