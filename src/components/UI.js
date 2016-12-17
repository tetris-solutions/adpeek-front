import React from 'react'
import Header from './Header'
import {branch} from 'baobab-react/higher-order'

const {PropTypes} = React

const UI = React.createClass({
  displayName: 'UI',
  propTypes: {
    hideLogin: PropTypes.bool,
    children: PropTypes.node.isRequired,
    userId: PropTypes.string,
    isGuest: PropTypes.bool,
    isAdmin: PropTypes.bool
  },
  childContextTypes: {
    isLoggedIn: PropTypes.bool,
    isGuest: PropTypes.bool,
    isAdmin: PropTypes.bool
  },
  getDefaultProps () {
    return {
      hideLogin: false
    }
  },
  getChildContext () {
    return {
      isLoggedIn: Boolean(this.props.userId),
      isGuest: Boolean(this.props.isGuest),
      isAdmin: Boolean(this.props.isAdmin)
    }
  },
  render () {
    const {children, hideLogin} = this.props

    return (
      <div className='mdl-layout__container'>
        <div className='mdl-layout mdl-layout--fixed-header is-upgraded'>
          <Header hideLogin={hideLogin}/>
          <main className='mdl-layout__content mdl-color--grey-300'>
            {children}
          </main>
        </div>
        <div className='mdl-layout__obfuscator'/>
      </div>
    )
  }
})

export default branch({
  'userId': ['user', 'id'],
  'isAdmin': ['user', 'is_admin'],
  'isGuest': ['user', 'is_guest']
}, UI)
