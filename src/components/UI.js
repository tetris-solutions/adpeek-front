import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import {branch} from './higher-order/branch'
import Loading from './Loading'

class UI extends React.Component {
  static displayName = 'UI'

  static propTypes = {
    hideLogin: PropTypes.bool,
    children: PropTypes.node.isRequired,
    userId: PropTypes.string,
    isGuest: PropTypes.bool,
    isAdmin: PropTypes.bool
  }

  static childContextTypes = {
    isLoggedIn: PropTypes.bool,
    isGuest: PropTypes.bool,
    isAdmin: PropTypes.bool
  }

  static defaultProps = {
    hideLogin: false
  }

  getChildContext () {
    return {
      isLoggedIn: Boolean(this.props.userId),
      isGuest: Boolean(this.props.isGuest),
      isAdmin: Boolean(this.props.isAdmin)
    }
  }

  render () {
    const {children, hideLogin} = this.props

    return (
      <div className='mdl-layout__container'>
        <div className='mdl-layout mdl-layout--fixed-header is-upgraded'>
          <Header hideLogin={hideLogin}/>
          <main id='main' className='mdl-layout__content mdl-color--grey-300'>
            {children}
          </main>
        </div>
        <div className='mdl-layout__obfuscator'/>
        <Loading/>
      </div>
    )
  }
}

export default branch({
  'userId': ['user', 'id'],
  'isAdmin': ['user', 'is_admin'],
  'isGuest': ['user', 'is_guest']
}, UI)
