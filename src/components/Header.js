import React from 'react'
import Breadcrumbs from './Breadcrumbs'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {branch} from 'baobab-react/dist-modules/higher-order'

const {PropTypes} = React

export function Header ({userName}) {
  return (
    <header className='mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600'>
      <div className='mdl-layout__drawer-button'/>
      <div className='mdl-layout__header-row'>
        <Breadcrumbs />

        <div className='mdl-layout-spacer'/>
        <span className='mdl-layout-title'>
          <Message name={userName}>welcomeMessage</Message>
        </span>
      </div>
    </header>
  )
}

Header.displayName = 'Header'
Header.propTypes = {
  userName: PropTypes.string
}

export default branch({
  userName: ['user', 'name']
}, Header)
