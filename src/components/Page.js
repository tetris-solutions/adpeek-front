import React from 'react'
import PropTypes from 'prop-types'
import {styledComponent} from './higher-order/styled'
import findLast from 'lodash/findLast'
import property from 'lodash/property'
import csjs from 'csjs'

const getAside = property('aside')

const style = csjs`
.page {
  display: flex;
  flex: 1;
  min-height: calc(100% - 64px);
  width: 100%;
  position: absolute;
  background: #e0e0e0;
}
.content {
  flex: 1;
  position: relative;
  overflow-x: hidden;
}
.nav {
  background: white;
  position: relative;
  flex: 0 0 12px;
}
.caret {
  display: block;
  position: absolute;
  cursor: pointer;
  top: 0;
  right: 0;
  height: 100%;
  width: 12px;
  background: white;
}
.caret > span {
  display: inline-block;
  font-size: 8px;
  margin: 40vh 0 0 2px;
}`

class Page extends React.Component {
  static displayName = 'Page'

  static propTypes = {
    children: PropTypes.node.isRequired
  }

  static contextTypes = {
    routes: PropTypes.array.isRequired
  }

  toggleNav = () => {
    this.setState({
      isNavOpen: !this.state.isNavOpen
    }, this.onAsideVisibilityChange)
  }

  readFromLocalStorage = () => {
    try {
      return window.localStorage.getItem('openSideNav') !== 'false'
    } catch (e) {
      return true
    }
  }

  onAsideVisibilityChange = () => {
    setTimeout(() => window.event$.emit('aside-toggle'), 300)

    try {
      window.localStorage.setItem('openSideNav', this.state.isNavOpen)
    } catch (e) {
    }
  }

  state = {
    isNavOpen: typeof window !== 'undefined' && this.readFromLocalStorage()
  }

  render () {
    const Aside = getAside(findLast(this.context.routes, getAside))
    const caret = this.state.isNavOpen ? '◀' : '▶'

    return (
      <div className={style.page}>
        <nav className={`mdl-shadow--6dp ${style.nav}`}>
          {Aside && this.state.isNavOpen
            ? <Aside/>
            : null}
          <div onClick={this.toggleNav} className={style.caret}>
            <span>{caret}</span>
          </div>
        </nav>
        <div className={style.content}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default styledComponent(Page, style)
