import React from 'react'
import Header from './Header'
import find from 'lodash/find'
import findLast from 'lodash/findLast'
import {sendHitAction} from '../actions/send-hit'

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
const levels = ['company', 'workspace', 'folder', 'campaign', 'report', 'order']
const App = React.createClass({
  displayName: 'App',
  propTypes: {
    children: PropTypes.node.isRequired,
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  },
  contextTypes: {
    tree: PropTypes.object.isRequired
  },
  childContextTypes: {
    company: PropTypes.object
  },
  componentDidMount () {
    this.track()
  },
  componentDidUpdate () {
    this.track()
  },
  track () {
    const {location: {pathname}, params} = this.props
    if (pathname === this.pathname) return

    this.pathname = pathname

    const isInParams = level => Boolean(params[level])
    const level = findLast(levels, isInParams)

    if (!level) return

    sendHitAction(this.context.tree, level, params)
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
