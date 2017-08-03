import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import csjs from 'csjs'
import {styledComponent} from './higher-order/styled'
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

export class MenuItem extends React.Component {
  static displayName = 'Menu-Item'
  static defaultProps = {
    tag: 'span',
    divider: false
  }

  static contextTypes = {
    hideTooltip: PropTypes.func.isRequired
  }

  static propTypes = {
    persist: PropTypes.bool,
    onClick: PropTypes.func,
    divider: PropTypes.bool,
    tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    icon: PropTypes.string,
    children: PropTypes.node.isRequired
  }

  onClick = e => {
    this.props.onClick(e)

    if (!this.props.persist) {
      this.context.hideTooltip()
    }
  }

  render () {
    let Tag = this.props.tag
    const {divider, children, icon} = this.props
    const ico = icon ? <i className={`material-icons ${style.ico}`}>{icon}</i> : null
    const btProps = omit(this.props, 'children', 'icon', 'tag', 'divider')

    if (btProps.disabled) {
      delete btProps.onClick
    }

    if (btProps.onClick) {
      btProps.onClick = this.onClick
    } else if (btProps.to) {
      Tag = Link
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
}

export const HeaderMenuItem = props => (
  <MenuItem {...props} tag='strong' className={style.menuHeader}>
    {props.children}
  </MenuItem>
)

HeaderMenuItem.propTypes = {
  children: PropTypes.node.isRequired
}

class DMenu extends React.Component {
  static displayName = 'Dropdown-Menu'
  static propTypes = {
    children: PropTypes.node.isRequired,
    provide: PropTypes.array,
    hover: PropTypes.bool,
    persist: PropTypes.bool
  }

  static defaultProps = {
    provide: [],
    hover: false,
    persist: false
  }

  render () {
    const {children, provide, hover, persist} = this.props
    return (
      <Tooltip provide={provide} hover={hover} persist={persist}>
        <div className={`mdl-menu__container is-visible ${style.menu}`}>
          <ul className={`mdl-menu ${style.options}`}>
            {children}
          </ul>
        </div>
      </Tooltip>
    )
  }
}

export const DropdownMenu = styledComponent(DMenu, style)
