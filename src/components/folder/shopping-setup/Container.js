import React from 'react'
import PropTypes from 'prop-types'

class ShoppingSetupContainer extends React.PureComponent {
  static displayName = 'Shopping-Setup-Container'

  static propTypes = {
    folder: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  render () {
    return (
      <p>
        Oi
      </p>
    )
  }
}

export default ShoppingSetupContainer
