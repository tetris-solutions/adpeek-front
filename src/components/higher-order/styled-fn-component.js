import React from 'react'
import PropTypes from 'prop-types'
import assign from 'lodash/assign'

export const styledFnComponent = (fnComponent, style) => class extends React.Component {
  static displayName = fnComponent.displayName
  static propTypes = fnComponent.propTypes
  static defaultProps = fnComponent.defaultProps || {}

  static contextTypes = assign({
    insertCss: PropTypes.func
  }, fnComponent.contextTypes)

  componentWillMount () {
    this.context.insertCss(style)
  }

  render () {
    return fnComponent(this.props, this.context)
  }
}
