import React from 'react'
import csjs from 'csjs'
import {styledFnComponent} from './higher-order/styled-fn-component'
import Tooltip from 'tetris-iso/Tooltip'
import omit from 'lodash/omit'
const style = csjs`
.visible {
  position: relative;
  display: block;
  width: auto;
  height: auto;
}
.menu extends .visible {}
.options extends .visible {
  padding: 0;
}
.item {
  height: auto;
}
.item > * {
  color: #545454 !important;
  font-size: small;
  text-decoration: none;
  display: block;
}
.ico {
  font-size: inherit;
  margin-right: .5em;
  transform: translateY(2px);
}
.menuHeader {
  display: block;
  font-size: 12pt;
  text-align: center;
  padding: .6em 0 0 0;
  border-bottom: 1px solid rgb(230, 230, 230);
}
.menuHeader > .ico {
  display: block;
  margin-right: 0;
}`

export const MenuItem = props => {
  const {divider, children, tag: Tag, icon} = props
  const ico = icon ? <i className={`material-icons ${style.ico}`}>{icon}</i> : null
  const btProps = omit(props, 'children', 'icon', 'tag', 'divider')

  if (btProps.disabled) {
    delete btProps.onClick
  }

  return (
    <li className={`mdl-menu__item ${style.item} ${divider ? 'mdl-menu__item--full-bleed-divider' : ''}`}>
      <Tag {...btProps}>
        {ico}
        {children}
      </Tag>
    </li>
  )
}

MenuItem.displayName = 'Menu-Item'
MenuItem.defaultProps = {
  tag: 'span',
  divider: false
}
MenuItem.propTypes = {
  divider: React.PropTypes.bool,
  tag: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
  icon: React.PropTypes.string,
  children: React.PropTypes.node.isRequired
}

export const HeaderMenuItem = props => (
  <MenuItem {...props} tag='strong' className={`${style.menuHeader}`}>
    {props.children}
  </MenuItem>
)

HeaderMenuItem.propTypes = {
  children: React.PropTypes.node.isRequired
}

const DMenu = ({children, provide}) => (
  <Tooltip provide={provide}>
    <div className={`mdl-menu__container is-visible ${style.menu}`}>
      <ul className={`mdl-menu ${style.options}`}>
        {children}
      </ul>
    </div>
  </Tooltip>
)

DMenu.defaultProps = {
  provide: []
}
DMenu.displayName = 'Dropdown-Menu'
DMenu.propTypes = {
  children: React.PropTypes.node.isRequired,
  provide: React.PropTypes.array
}

export const DropdownMenu = styledFnComponent(DMenu, style)
