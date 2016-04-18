import React from 'react'
import {branch} from 'baobab-react/dist-modules/higher-order'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {logoutAction} from '@tetris/front-server/lib/actions/logout-action'
import find from 'lodash/find'

const {PropTypes} = React

export const App = React.createClass({
  displayName: 'App',
  propTypes: {
    children: PropTypes.node,
    params: PropTypes.shape({
      company: PropTypes.string
    }),
    user: PropTypes.shape({
      name: PropTypes.string,
      companies: PropTypes.array
    }),
    dispatch: PropTypes.func
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  childContextTypes: {
    company: PropTypes.object
  },
  handleLogoutClick (e) {
    e.preventDefault()
    this.props.dispatch(logoutAction)
    this.context.router.push('/')
  },
  getCompany () {
    return find(this.props.user.companies, {id: this.props.params.company})
  },
  getChildContext () {
    return {
      company: this.getCompany()
    }
  },
  render () {
    const {children, user: {name}} = this.props
    return (
      <div className='mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header'>
        <header className='mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600'>
          <div className='mdl-layout__header-row'>
            <span className='mdl-layout-title'>
              <Message name={name}>welcomeMessage</Message>
            </span>
            <div className='mdl-layout-spacer'/>
          </div>
        </header>
        <div className='mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50'>
          <nav className='mdl-navigation mdl-color--blue-grey-800'>
            <a href='/' className='mdl-navigation__link' onClick={this.handleLogoutClick}>
              <i className='mdl-color-text--blue-grey-400 material-icons'>close</i>
              <strong>
                <Message>navLogout</Message>
              </strong>
            </a>
          </nav>
        </div>
        <main className='mdl-layout__content mdl-color--grey-100'>
          {children}
        </main>
      </div>
    )
  }
})

export default branch({user: ['user']}, App)
