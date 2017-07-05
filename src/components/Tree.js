import React from 'react'
import PropTypes from 'prop-types'
import csjs from 'csjs'
import {styledFunctionalComponent} from './higher-order/styled'

const style = csjs`
.list {
  padding: 0;
  margin: 0;
  list-style: none;
}
.total {
  color: #004465
}
.partial {
  color: #4650a0
}
.item {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.item > strong {
  cursor: pointer;
}
.item > i {
  cursor: pointer;
  float: left;
  padding-right: .3em
}
.subTree {
  margin-left: .7em;
}`

export class Node extends React.Component {
  static displayName = 'Node'
  static propTypes = {
    selection: PropTypes.oneOf(['partial', 'total']),
    onClick: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    children: PropTypes.node,
    label: PropTypes.node
  }

  state = {
    open: false
  }

  isOpen () {
    return this.state.open
  }

  toggle = () => {
    const open = !this.state.open

    this.setState({open}, open
      ? this.props.onOpen
      : this.props.onClose)
  }

  render () {
    const {open} = this.state
    const {selection, label, onClick, children} = this.props

    return (
      <li>
        <header className={`${style.item} ${selection ? style[selection] : ''}`}>
          <i onClick={this.toggle} className='material-icons'>{
            open ? 'keyboard_arrow_down' : 'keyboard_arrow_right'
          }</i>
          <strong onClick={onClick}>
            {label}
          </strong>
        </header>
        <div className={style.subTree}>
          {open ? children : null}
        </div>
      </li>
    )
  }
}

const Root = ({children}) => <ul className={style.list}>{children}</ul>

Root.displayName = 'Tree'
Root.propTypes = {
  children: PropTypes.node
}

export const Tree = styledFunctionalComponent(Root, style)
