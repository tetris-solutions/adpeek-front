export const runningActionCounter = 'running'

export function intercept (tree, preload) {
  tree.set(runningActionCounter, 0)
  tree.commit()

  function trap (action) {
    function start () {
      if (action.name) {
        /* eslint-disable */
        console.time(action.name)
        /* eslint-enable */
      }

      tree.set(runningActionCounter, tree.get(runningActionCounter) + 1)
      tree.commit()
    }

    function finish () {
      if (action.name) {
        /* eslint-disable */
        console.timeEnd(action.name)
        /* eslint-enable */
      }

      tree.set(runningActionCounter, tree.get(runningActionCounter) - 1)
      tree.commit()
    }

    return (...args) =>
      Promise.resolve()
        .then(start)
        .then(() => action(...args))
        .then(result => {
          finish()

          return result
        }, rejection => {
          finish()

          throw rejection
        })
  }

  return (...actions) => preload(...actions.map(trap))
}
