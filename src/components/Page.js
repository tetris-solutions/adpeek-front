import React from 'react'
import {styled} from './mixins/styled'
import findLast from 'lodash/findLast'
import has from 'lodash/fp/has'
import property from 'lodash/property'
import csjs from 'csjs'

const hasSubNav = has('aside')
const getSubNav = property('aside')

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

const Page = React.createClass({
  displayName: 'Page',
  mixins: [styled(style)],
  propTypes: {
    children: React.PropTypes.node.isRequired
  },
  contextTypes: {
    routes: React.PropTypes.array.isRequired
  },
  getInitialState () {
    return {
      isNavOpen: typeof window !== 'undefined' && this.readFromLocalStorage()
    }
  },
  toggleNav () {
    this.setState({
      isNavOpen: !this.state.isNavOpen
    }, this.onAsideVisibilityChange)
  },
  readFromLocalStorage () {
    try {
      return window.localStorage.getItem('openSideNav') !== 'false'
    } catch (e) {
      return true
    }
  },
  onAsideVisibilityChange () {
    window.event$.emit('aside-toggle')

    try {
      window.localStorage.setItem('openSideNav', this.state.isNavOpen)
    } catch (e) {
    }
  },
  render () {
    const SubNav = getSubNav(findLast(this.context.routes, hasSubNav))
    const caret = this.state.isNavOpen ? '◀' : '▶'

    return (
      <div className={String(style.page)}>
        <nav className={`mdl-shadow--6dp ${style.nav}`}>
          {SubNav && this.state.isNavOpen ? <SubNav /> : null}
          <div onClick={this.toggleNav} className={String(style.caret)}>
            <span>{caret}</span>
          </div>
        </nav>
        <div className={String(style.content)}>
          {this.props.children}
        </div>
      </div>
    )
  }
})

export default Page
