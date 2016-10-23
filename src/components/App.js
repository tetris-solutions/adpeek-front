import React from 'react'
import Header from './Header'
// import SideNav from './SideNav'
import find from 'lodash/find'

const {PropTypes} = React

const UI = ({children}) => (
  <div className='mdl-layout__container'>
    <div className='mdl-layout mdl-layout--fixed-header is-upgraded'>
      <Header />
      {/* <SideNav /> */}
      <main className='mdl-layout__content'>
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

const App = React.createClass({
  displayName: 'App',
  propTypes: {
    children: PropTypes.node.isRequired,
    params: PropTypes.shape({
      company: PropTypes.string
    }).isRequired
  },
  contextTypes: {
    tree: PropTypes.object.isRequired
  },
  childContextTypes: {
    company: PropTypes.object
  },
  getChildContext () {
    return {
      company: this.getCompany()
    }
  },
  getCompany () {
    const {tree} = this.context
    const companies = tree.get(['user', 'companies'])

    return find(companies, ['id', this.props.params.company])
  },
  render () {
    return <UI>{this.props.children}</UI>
  }
})

export default App
