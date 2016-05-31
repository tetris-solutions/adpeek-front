import React from 'react'
import {branch} from 'baobab-react/dist-modules/higher-order'
import Header from './Header'
import find from 'lodash/find'
import SideNav from './SideNav'
import map from 'lodash/map'

const {PropTypes} = React

const levels = ['company', 'companies', [
  ['workspace', 'workspaces', [
    ['folder', 'folders', [
      ['campaign', 'campaigns'],
      ['order', 'orders']
    ]]
  ]]
]]

function buildContext (context, params, obj, level) {
  const [singular, plural, nextLevel] = level

  if (!obj || !params[singular]) return

  obj = find(obj[plural], {id: params[singular]})
  context[singular] = obj || null

  map(nextLevel, child =>
    buildContext(context, params, obj, child))
}

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
    campaign: PropTypes.any,
    order: PropTypes.any
  },
  componentWillMount () {
    this.styles = []
    this.styleText = ''
  },
  getChildContext () {
    const context = {
      company: null,
      workspace: null,
      folder: null,
      campaign: null,
      order: null
    }

    buildContext(context, this.props.params, this.props.user, levels)

    return context
  },
  render () {
    const {children, user, params, routes} = this.props

    return (
      <div className='mdl-layout__container'>
        <div className='mdl-layout mdl-layout--fixed-drawer mdl-layout--fixed-header is-upgraded'>
          <Header
            user={user}
            params={params}
            routes={routes}/>

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

export default branch({user: ['user']}, App)
