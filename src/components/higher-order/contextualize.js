import React from 'react'
import assign from 'lodash/assign'

const {PropTypes} = React

export function contextualize (Component, ...names) {
  const contextTypes = {}

  names.forEach(name => {
    contextTypes[name] = PropTypes.any
  })

  return React.createClass({
    displayName: `${Component.displayName}(${names.join(', ')})`,
    getInitialState () {
      return {}
    },
    contextTypes,
    componentWillMount () {
      this.setState(assign({}, this.context))
    },
    componentWillReceiveProps (props, context) {
      const newState = {}

      names.forEach(name => {
        if (context[name] && context[name] !== this.state[name]) {
          newState[name] = context[name]
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
