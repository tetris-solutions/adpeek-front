import queue from 'queue'
import 'setimmediate'

const stack = queue({
  concurrency: 1,
  autostart: true
})

const pass = (cb, fulfill) => r => {
  cb()
  fulfill(r)
}

const leak = (cb, fail) => err => {
  cb()
  fail(err)
}

const run = (fn, args) =>
  Promise.resolve()
    .then(() => fn(...args))

export const queueHardLift = (fn, t = 50) => (...args) =>
  new Promise((resolve, reject) =>
// eslint-disable-next-line promise/param-names
    stack.push(() => new Promise(next =>
      setImmediate(() =>
        run(fn, args).then(
          pass(next, resolve),
          leak(next, reject))))))

