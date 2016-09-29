import React from 'react'
import Header from './Header'
import SideNav from './SideNav'

const {PropTypes} = React

const App = ({children}) => (
  <div className='mdl-layout__container'>
    <div className='mdl-layout mdl-layout--fixed-drawer mdl-layout--fixed-header is-upgraded'>
      <Header />
      <SideNav />
      <main className='mdl-layout__content mdl-color--grey-100'>
        {children}
      </main>
    </div>
    <div className='mdl-layout__obfuscator'/>
  </div>
)

App.displayName = 'App'
App.propTypes = {
  children: PropTypes.node
}

export default App
