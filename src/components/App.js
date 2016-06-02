import React from 'react'
import Header from './Header'
import SideNav from './SideNav'

const {PropTypes} = React

export const App = React.createClass({
  displayName: 'App',
  propTypes: {
    children: PropTypes.node,
    routes: PropTypes.array,
    params: PropTypes.shape({
      company: PropTypes.string
    }),
    dispatch: PropTypes.func
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  render () {
    const {children, params, routes} = this.props

    return (
      <div className='mdl-layout__container'>
        <div className='mdl-layout mdl-layout--fixed-drawer mdl-layout--fixed-header is-upgraded'>
          <Header params={params} routes={routes}/>

          <SideNav
            params={params}
            routes={routes}
            router={this.context.router}/>

          <main className='mdl-layout__content mdl-color--grey-100'>
            {children}
          </main>
        </div>
        <div className='mdl-layout__obfuscator'></div>
      </div>
    )
  }
})

export default App
