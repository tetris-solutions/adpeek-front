import React from 'react'
import {logoutAction} from '@tetris/front-server/lib/actions/logout-action'
import {branch} from 'baobab-react/dist-modules/higher-order'
import Message from '@tetris/front-server/lib/components/intl/Message'
import LocaleSelector from './LocaleSelector'
import findLast from 'lodash/findLast'
import property from 'lodash/property'
import has from 'lodash/fp/has'

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

        <nav className='mdl-navigation mdl-color--blue-grey-800'>
          <a href='/' className='mdl-navigation__link' onClick={this.handleLogoutClick}>
            <i className='mdl-color-text--blue-grey-400 material-icons'>close</i>
            <strong>
              <Message>navLogout</Message>
            </strong>
          </a>
        </nav>

        <LocaleSelector/>
      </aside>
    )
  }
})

export default branch({}, SideNav)
