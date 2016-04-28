import React from 'react'
import csjs from 'csjs'
import map from 'lodash/map'
import {Link} from 'react-router'

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

export function ContextMenu ({options, title, icon}, {insertCss}) {
  insertCss(style)
  return (
    <header className={style.header}>
      <i className={`material-icons ${style.icon}`}>{icon}</i>
      <h5>{title}</h5>
      {map(options, ({to, label}, index) => (
        <Link key={index} className='mdl-button mdl-color-text--grey-100' to={to}>
          {label}
        </Link>
      ))}
    </header>
  )
}

ContextMenu.displayName = 'Context-Menu'
ContextMenu.propTypes = {
  title: PropTypes.node,
  icon: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    to: PropTypes.string,
    label: PropTypes.node
  }))
}
ContextMenu.contextTypes = {
  insertCss: PropTypes.func
}

export default ContextMenu
