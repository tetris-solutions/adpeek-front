import React from 'react'

export function styledFnComponent (Component, style) {
  return React.createClass({
    displayName: `Styled(${Component.displayName})`,
    contextTypes: {
      insertCss: React.PropTypes.func
    },
    componentWillMount () {
      this.context.insertCss(style)
    },
    render () {
      return <Component {...this.props} />
    }
  })
}
