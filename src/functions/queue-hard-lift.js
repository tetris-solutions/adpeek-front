import 'setimmediate'
import noop from 'lodash/noop'
import global from 'global'
import {randomString} from './random-string'
import find from 'lodash/find'

const q = global.mQueue = {
  tasks: [],
  running: null
}

let immediateId

const wrapGently = enhancer => op => {
  const wrapper = enhancer(op)
  wrapper._op_ = op._op_ || op
  return wrapper
}

const run = (fn, ...args) =>
  Promise.resolve()
    .then(() => fn(...args))

const delayed = wrapGently(
  task => () => new Promise(resolve =>
    setImmediate(() =>
      task()
        .catch(noop)
        .then(resolve))))

function pull (ls, x) {
  for (let i = 0; i < ls.length; i++) {
    if (ls[i] === x) {
      ls.splice(i, 1)
      break
    }
  }

  return ls
}

function getTask () {
  if (!q.running) return q.tasks.shift()

  const task = find(q.tasks, {parent: q.running.signature})

  if (task) {
    pull(q.tasks, task)
  }

  return task
}

function next () {
  clearImmediate(immediateId)

  const task = getTask()

  if (task) {
    q.running = q.running || task

    task()
      .catch(noop)
      .then(() => {
        q.running = null
      })
  }

  if (q.tasks.length) {
    immediateId = setImmediate(next)
  }
}

export const createTask = (fn, parent = null) => {
  const signature = randomString() + '-' + (fn.name || 'λ')

  const wrapper = (...args) =>
    new Promise((resolve, reject) => {
      const call = wrapGently(fn => () =>
        run(fn, ...args)
          .then(resolve, reject))

      const task = delayed(call(fn))
      task.signature = signature
      task.parent = parent

      q.tasks.push(task)

      next()
    })

  wrapper.subRoutine = op => createTask(op, signature)
  wrapper.fork = op => wrapper.subRoutine(op)()
  wrapper.recur = (...args) => wrapper.subRoutine(fn)(...args)

  return wrapper
}
