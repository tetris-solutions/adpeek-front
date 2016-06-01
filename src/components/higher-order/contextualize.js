import React from 'react'
import assign from 'lodash/assign'
import forEach from 'lodash/forEach'
import includes from 'lodash/includes'

const {PropTypes} = React
const paramDependent = ['company', 'workspace', 'folder', 'order']

export function contextualize (Component, ...names) {
  const contextTypes = {}

  forEach(names, name => {
    contextTypes[name] = PropTypes.any
  })

  return React.createClass({
    displayName: `Contextualize(${[Component.displayName].concat(names).join(', ')})`,
    getInitialState () {
      return {}
    },
    contextTypes,
    componentWillMount () {
      this.setState(assign({}, this.context))
    },
    componentWillReceiveProps (props, context) {
      const newState = {}

      forEach(names, name => {
        if (includes(paramDependent, name) && !props.params[name]) {
          newState[name] = null
        }
        if (context[name] && context[name] !== this.state[name]) {
          newState[name] = assign({}, this.state[name], context[name])
        }
      })

      if (Object.keys(newState).length) {
        this.setState(newState)
      }
    },
    render () {
      return <Component {...this.props} {...this.state} />
    }
  })
}
