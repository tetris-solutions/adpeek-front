import React from 'react'
import csjs from 'csjs'

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

function VerticalAlign ({children, className}, {insertCss}) {
  insertCss(style)
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
VerticalAlign.contextTypes = {
  insertCss: PropTypes.func
}

export default VerticalAlign
