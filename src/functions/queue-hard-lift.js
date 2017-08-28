import 'setimmediate'

const run = (fn, ...args) =>
  Promise.resolve()
    .then(() => fn(...args))

export const createTask = (fn, parent = null) => (...args) =>
  new Promise((resolve, reject) =>
    setImmediate(() => run(fn, ...args)
      .then(resolve, reject)))
