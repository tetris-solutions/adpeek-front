import csjs from 'csjs'
import React from 'react'

import {styledFnComponent} from './higher-order/styled-fn-component'
const style = csjs`
.verticallyAligned {
  display: inline-flex;
  vertical-align: middle;
}
.verticallyAligned > div {
  margin: auto 0;
  width: 100%
}`

function VerticalAlign ({children, className, style: css}) {
  return (
    <div className={`${className} ${style.verticallyAligned}`} style={css}>
      {children}
    </div>
  )
}

VerticalAlign.defaultProps = {
  className: ''
}
VerticalAlign.displayName = 'Vertical-Align'
VerticalAlign.propTypes = {
  style: React.PropTypes.object,
  children: React.PropTypes.node.isRequired,
  className: React.PropTypes.string
}

export default styledFnComponent(VerticalAlign, style)
