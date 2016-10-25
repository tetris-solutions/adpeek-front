import React from 'react'
import {styled} from './mixins/styled'
import findLast from 'lodash/findLast'
import has from 'lodash/fp/has'
import property from 'lodash/property'
import csjs from 'csjs'
// import LocaleSelector from './LocaleSelector'

const {PropTypes} = React
const hasSubNav = has('aside')
const getSubNav = property('aside')

const style = csjs`
.page {
  display: flex;
  flex: 1;
  min-height: calc(100% - 64px);
  width: 100%;
  position: absolute;
}
.content {
  flex: 1;
  position: relative;
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
}
.hack {
  position: absolute;
  width: 100%;
}`

const Page = React.createClass({
  displayName: 'Page',
  mixins: [styled(style)],
  propTypes: {
    children: PropTypes.node.isRequired
  },
  contextTypes: {
    routes: PropTypes.array.isRequired
  },
  getInitialState () {
    return {isNavOpen: true}
  },
  toggleNav () {
    this.setState({isNavOpen: !this.state.isNavOpen})
  },
  render () {
    const SubNav = getSubNav(findLast(this.context.routes, hasSubNav))

    return (
      <div className={String(style.page)}>
        <nav className={`mdl-shadow--6dp ${style.nav}`}>
          {SubNav && this.state.isNavOpen ? <SubNav /> : null}
          <div onClick={this.toggleNav} className={String(style.caret)}>
            <span>&#9658;</span>
          </div>
        </nav>
        <div className={String(style.content)}>
          <div className={String(style.hack)}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
})

export default Page
