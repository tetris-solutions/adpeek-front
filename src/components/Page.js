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
  position: absolute;
}
.content {
  flex: 1;
  position: relative;
}
.nav {
  background: white;
  flex: 0 0 320px;
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
    return {isNavOpen: false}
  },
  render () {
    const SubNav = getSubNav(findLast(this.context.routes, hasSubNav))

    return (
      <div className={String(style.page)}>
        <nav className={`mdl-shadow--6dp ${style.nav}`}>
          {SubNav ? <SubNav /> : null}
        </nav>
        <div className={String(style.content)}>
          {this.props.children}
        </div>
      </div>
    )
  }
})

export default Page
