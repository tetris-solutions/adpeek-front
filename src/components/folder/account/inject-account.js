import React from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'

export const injectAccount = Component => class extends React.Component {
  static displayName = `injectAccount(${Component.displayName})`

  static propTypes = {
    account: PropTypes.shape({
      details: PropTypes.object
    })
  }

  render () {
    return (
      <Component
        {...omit(this.props, 'account')}
        {...this.props.account.details}
        level='account'/>
    )
  }
}
