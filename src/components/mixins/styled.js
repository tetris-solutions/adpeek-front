import React from 'react'

export function styled (style) {
  return {
    contextTypes: {
      insertCss: React.PropTypes.func
    },
    componentWillMount () {
      this.context.insertCss(style)
    }
  }
}
