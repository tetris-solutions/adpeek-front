import React from 'react'
import Breadcrumbs from './Breadcrumbs'
import Message from '@tetris/front-server/lib/components/intl/Message'

const {PropTypes} = React

export function Header ({user, params, routes}) {
  return (
    <header className='mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600'>
      <div className='mdl-layout__drawer-button'/>
      <div className='mdl-layout__header-row'>
        <Breadcrumbs params={params} routes={routes}/>

        <div className='mdl-layout-spacer'/>

        <span className='mdl-layout-title'>
          <Message name={user.name}>welcomeMessage</Message>
        </span>
      </div>
    </header>
  )
}

Header.displayName = 'Header'
Header.propTypes = {
  user: PropTypes.object,
  params: PropTypes.object,
  routes: PropTypes.array
}

export default Header
