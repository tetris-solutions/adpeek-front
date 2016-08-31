import findLast from 'lodash/findLast'
import has from 'lodash/fp/has'
import property from 'lodash/property'
import React from 'react'
import {logoutAction} from '@tetris/front-server/lib/actions/logout-action'
import {branch} from 'baobab-react/higher-order'

import LocaleSelector from './LocaleSelector'

const {PropTypes} = React
const hasSubNav = has('aside')
const getSubNav = property('aside')

export const SideNav = React.createClass({
  displayName: 'Side-Nav',
  propTypes: {
    dispatch: PropTypes.func
  },
  contextTypes: {
    router: PropTypes.object,
    routes: PropTypes.array
  },
  handleLogoutClick (e) {
    e.preventDefault()
    this.props.dispatch(logoutAction)
    this.context.router.push('/')
  },
  render () {
    const SubNav = getSubNav(findLast(this.context.routes, hasSubNav))

    return (
      <aside className='mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50'>
        {SubNav ? <SubNav /> : null}
        <LocaleSelector/>
      </aside>
    )
  }
})

export default branch({}, SideNav)
