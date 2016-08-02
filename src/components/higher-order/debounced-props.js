import React from 'react'
import assign from 'lodash/assign'

const WAIT_FOR = 1000

export function debouncedProps (Component, time = WAIT_FOR) {
  let timeout

  return React.createClass({
    displayName: `Debounce(${Component.displayName})`,
    getInitialState () {
      return assign({}, this.props)
    },
    componentWillReceiveProps (nextProps) {
      clearTimeout(timeout)
      timeout = setTimeout(() => this.setState(nextProps), time)
    },
    render () {
      return <Component {...this.state} />
    }
  })
}
