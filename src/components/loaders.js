const screen = fn => (nextState, callback) => fn(comp => callback(null, comp.default))
const isServer = typeof document === 'undefined'

if (isServer) {
  /* eslint-disable */
  eval('require.ensure = function (nope, fn) {fn(require);}')
  /* eslint-enable */
}

function bypass (getComponent) {
  let component

  getComponent(null, (_, x) => {
    component = x
  })

  return {component}
}

export const component = isServer ? bypass : getComponent => ({getComponent})

export default {
  App: screen(render => require.ensure([], require => render(require('./App'))))
}
