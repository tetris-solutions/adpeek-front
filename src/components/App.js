import React from 'react'
import {Link} from 'react-router'
import {branch} from 'baobab-react/dist-modules/higher-order'
import Header from './Header'
import find from 'lodash/find'
import SideNav from './SideNav'

const {PropTypes} = React

const levels = [
  ['company', 'companies'],
  ['workspace', 'workspaces'],
  ['folder', 'folders'],
  ['campaign', 'campaigns']
]

export const App = React.createClass({
  displayName: 'App',
  propTypes: {
    children: PropTypes.node,
    routes: PropTypes.array,
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
    company: PropTypes.any,
    workspace: PropTypes.any,
    folder: PropTypes.any,
    campaign: PropTypes.any
  },
  getChildContext () {
    const context = {}
    let obj = this.props.user

    const {params} = this.props

    for (var i = 0; i < levels.length; i++) {
      const [singular, plural] = levels[i]

      context[singular] = null

      if (obj && params[singular]) {
        obj = find(obj[plural], {id: params[singular]})
        context[singular] = obj || null
      }
    }

    return context
  },
  render () {
    const {children, user, params, routes} = this.props

    return (
      <div className='mdl-layout__container'>
        <div className='mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header is-upgraded'>
          <Header
            user={user}
            params={params}
            routes={routes}/>

          <SideNav/>

          <main className='mdl-layout__content mdl-color--grey-100'>
            {children}
          </main>
        </div>
        <div className='mdl-layout__obfuscator'></div>
      </div>
    )
  }
})

export function Breadcrumb (props, {company}) {
  if (!company) return null
  return (
    <Link to={`/company/${company.id}`}>
      {company.name}
    </Link>
  )
}

Breadcrumb.displayName = 'Company-Breadcrumb'
Breadcrumb.contextTypes = {
  company: PropTypes.object
}

export default branch({user: ['user']}, App)
