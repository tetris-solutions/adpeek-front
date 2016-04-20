import React from 'react'
import {branch} from 'baobab-react/dist-modules/higher-order'
import Message from '@tetris/front-server/lib/components/intl/Message'

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
    const {children, user: {name}} = this.props
    return (
      <div className='mdl-layout__container'>
        <div className='mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header is-upgraded'>
          <header className='mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600'>
            <div className='mdl-layout__drawer-button'/>
            <div className='mdl-layout__header-row'>
              <span className='mdl-layout-title'>
                <Message name={name}>welcomeMessage</Message>
              </span>
              <div className='mdl-layout-spacer'/>
            </div>
          </header>
          <div className='mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50'>
            <SideNav/>
          </div>
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
