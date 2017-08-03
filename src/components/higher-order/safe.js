import React from 'react'
import log from 'loglevel'

const isServer = typeof document === 'undefined'

// @todo not actually safe
export const safe = Component => class Safe extends React.Component {
  static displayName = `safe(${Component.displayName})`

  componentDidCatch (error, info) {
    error = error || new Error('UI Exception')

    if (isServer) {
      log.error(info, error)
      throw error
    }

    error.info = info
    error.level = 'erro'
    window.$tate.push('alerts', error)
  }

  componentWillUnmount () {
    this.dead = true
  }

  render () {
    return <Component {...this.props}/>
  }
}
