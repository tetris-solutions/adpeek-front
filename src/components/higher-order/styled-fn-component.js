import React from 'react'
import assign from 'lodash/assign'

export const styledFnComponent = (fnComponent, style) => React.createClass({
  displayName: fnComponent.displayName,
  propTypes: fnComponent.propTypes,
  getDefaultProps () {
    return fnComponent.defaultProps
  },
  contextTypes: assign({
    insertCss: React.PropTypes.func
  }, fnComponent.contextTypes),
  componentWillMount () {
    this.context.insertCss(style)
  },
  render () {
    return fnComponent(this.props, this.context)
  }
})
