export const createTask = (fn, parent = null) =>
  (...args) => Promise.resolve().then(() => fn(...args))
