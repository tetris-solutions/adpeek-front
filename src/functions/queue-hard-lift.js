export const createTask = fn => (...args) =>
  Promise.resolve()
    .then(() => fn(...args))
