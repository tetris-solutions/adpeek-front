import React from 'react'
import csjs from 'csjs'
import {styledFnComponent} from './higher-order/styled-fn-component'

const {PropTypes} = React
const style = csjs`
.verticallyAligned {
  display: inline-flex;
  vertical-align: middle;
}
.verticallyAligned > div {
  margin: auto 0;
  width: 100%
}`

function VerticalAlign ({children, className}) {
  return (
    <div className={`${className} ${style.verticallyAligned}`}>
      {children}
    </div>
  )
}

VerticalAlign.defaultProps = {
  className: ''
}
VerticalAlign.displayName = 'Vertical-Align'
VerticalAlign.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

export default styledFnComponent(VerticalAlign)
