import React from 'react'
import assign from 'lodash/assign'

export function styledFnComponent (fnComponent, style) {
  let inserted = false

  function proxyFnComponent (props, context) {
    if (!inserted) {
      context.insertCss(style)
      inserted = true
    }

    return fnComponent(props, context)
  }

  proxyFnComponent.displayName = fnComponent.displayName
  proxyFnComponent.propTypes = fnComponent.propTypes
  proxyFnComponent.defaultProps = fnComponent.defaultProps
  proxyFnComponent.contextTypes = assign({
    insertCss: React.PropTypes.func
  }, fnComponent.contextTypes)

  return proxyFnComponent
}
