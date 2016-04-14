import React from 'react'
import LocaleSelector from './HeaderLocaleSelector'
import {IndexLink} from 'react-router'
import {logoutAction} from '@tetris/front-server/lib/actions/logout-action'
import {branch} from 'baobab-react/dist-modules/higher-order'
import Message from '@tetris/front-server/lib/components/intl/Message'
import window from 'global/window'

const {PropTypes} = React

export const Header = React.createClass({
  displayName: 'Header',
  propTypes: {
    user: PropTypes.object,
    dispatch: PropTypes.func
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  handleLogoutClick (e) {
    e.preventDefault()
    this.props.dispatch(logoutAction)
    this.context.router.push('/')
  },
  render () {
    let loginUrl = `${process.env.FRONT_URL}/login`

    if (window.location) { // not server side
      loginUrl += `?next=${window.location.href}`
    }

    return (
      <nav className='navbar navbar-default'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <IndexLink className='navbar-brand' to='/'>AdPeek</IndexLink>
          </div>

          {this.props.user ? (
            <ul ref='ul' className='nav navbar-nav navbar-right'>
              <li>
                <a href='/' onClick={this.handleLogoutClick}>
                  <Message>navLogout</Message>
                </a>
              </li>
            </ul>
          ) : (
            <ul ref='ul' className='nav navbar-nav navbar-right'>
              <li>
                <a href={`${process.env.FRONT_URL}/signup`}>
                  <Message>navSignup</Message>
                </a>
              </li>
              <li>
                <a href={loginUrl}>
                  <Message>navLogin</Message>
                </a>
              </li>
            </ul>
          )}

          <LocaleSelector />
        </div>
      </nav>
    )
  }
})

export default branch({user: ['user']}, Header)
