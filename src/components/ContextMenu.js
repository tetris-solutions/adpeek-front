import React from 'react'
import csjs from 'csjs'
import {styledFnComponent} from './higher-order/styled-fn-component'

const style = csjs`
.header {
  text-align: center;
  width: 100%;
  overflow: hidden;
  margin-bottom: .4em;
}
.icon {
  margin-top: .3em;
  font-size: 56px;
}`

const {PropTypes} = React

export function ContextMenu ({children, title, icon}) {
  return (
    <header className={style.header}>
      <i className={`material-icons ${style.icon}`}>{icon}</i>
      <h5>{title}</h5>
      {children}
    </header>
  )
}

ContextMenu.displayName = 'Context-Menu'
ContextMenu.propTypes = {
  title: PropTypes.node,
  icon: PropTypes.string,
  children: PropTypes.node
}

export default styledFnComponent(ContextMenu, style)
