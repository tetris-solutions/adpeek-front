import React from 'react'
import {logoutAction} from '@tetris/front-server/lib/actions/logout-action'
import {branch} from 'baobab-react/dist-modules/higher-order'
import Message from '@tetris/front-server/lib/components/intl/Message'
import LocaleSelector from './LocaleSelector'

const {PropTypes} = React

export const SideNav = React.createClass({
  displayName: 'Side-Nav',
  propTypes: {
    dispatch: PropTypes.func
  },
  contextTypes: {
    router: PropTypes.object
  },
  handleLogoutClick (e) {
    e.preventDefault()
    this.props.dispatch(logoutAction)
    this.context.router.push('/')
  },
  render () {
    return (
      <aside className='mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50'>
        <nav className='mdl-navigation mdl-color--blue-grey-800'>
          <a href='/' className='mdl-navigation__link' onClick={this.handleLogoutClick}>
            <i className='mdl-color-text--blue-grey-400 material-icons'>close</i>
            <strong>
              <Message>navLogout</Message>
            </strong>
          </a>

          <LocaleSelector/>
        </nav>
      </aside>
    )
  }
})

export default branch({}, SideNav)
