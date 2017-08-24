import 'setimmediate'
import noop from 'lodash/noop'

const tasks = window.task$ = []
let running = false
let timeout

const run = (fn, ...args) =>
  Promise.resolve()
    .then(() => fn(...args))

const delayed = fn => new Promise(resolve =>
  setImmediate(() => run(fn).catch(noop).then(resolve)))

function next () {
  clearTimeout(timeout)

  if (running) {
    timeout = setTimeout(next, 100)
    return
  }

  const task = tasks.shift()

  if (!task) return

  running = true

  run(task)
    .catch(noop)
    .then(() => {
      running = false
    })

  if (tasks.length) {
    setImmediate(next)
  }
}

export const queueHardLift = (fn, t = 50) => (...args) =>
  new Promise((resolve, reject) => {
    const call = () =>
      run(fn, ...args)
        .then(resolve, reject)

    tasks.push(delayed(call))

    next()
  })

