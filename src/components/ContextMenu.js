import csjs from 'csjs'
import React from 'react'

import {styledFnComponent} from './higher-order/styled-fn-component'

const style = csjs`
.header {
  width: 100%;
  overflow: hidden;
  margin-bottom: .4em;
}
.icon {
  margin-top: .3em;
  font-size: 56px;
}
.header > div {
  text-align: center
}
.header > nav > a {
  cursor: pointer;
  padding-left: 1em !important;
  color: white !important;
}
.header > nav > a:hover {
  background-color: rgba(200, 200, 200, 0.2) !important;
}
.header > nav i {
  margin-right: .5em;
}`

const {PropTypes} = React

export function ContextMenu ({children, title, icon}) {
  return (
    <header className={`${style.header}`}>
      <div>
        <i className={`material-icons ${style.icon}`}>{icon}</i>
        <h5>{title}</h5>
      </div>
      <nav className='mdl-navigation'>
        {children}
      </nav>
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
