import React from 'react'
import Header from './Header'

const {PropTypes} = React

const UI = ({children}) => (
  <div className='mdl-layout__container'>
    <div className='mdl-layout mdl-layout--fixed-header is-upgraded'>
      <Header />
      <main className='mdl-layout__content mdl-color--grey-300'>
        {children}
      </main>
    </div>
    <div className='mdl-layout__obfuscator'/>
  </div>
)

UI.displayName = 'UI'
UI.propTypes = {
  children: PropTypes.node.isRequired
}

export default UI
