import React from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'

export const injectAdGroup = Component => class extends React.Component {
  static displayName = `injectAdGroup(${Component.displayName})`

  static propTypes = {
    details: PropTypes.object
  }

  render () {
    return (
      <Component
        {...omit(this.props, 'details')}
        {...this.props.details}
        level='adGroup'/>
    )
  }
}
