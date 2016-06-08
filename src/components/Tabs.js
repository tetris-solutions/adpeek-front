import React from 'react'
import window from 'global/window'

const {Children, PropTypes} = React

function TabHeader ({children, href}) {
  return (
    <a className='mdl-tabs__tab' href={href}>
      {children}
    </a>
  )
}

TabHeader.displayName = 'Tab-Header'
TabHeader.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export const Tabs = React.createClass({
  displayName: 'Tabs',
  propTypes: {
    children: PropTypes.node.isRequired
  },
  componentDidMount () {
    /**
     * @var {HTMLDivElement} el
     */
    const el = this.refs.wrapper
    const firstPanel = el.querySelector('.mdl-tabs__panel')

    if (firstPanel) {
      el.querySelector('.mdl-tabs__tab').className += ' is-active'

      firstPanel.className += ' is-active'
    }

    window.componentHandler.upgradeElement(el)
  },
  render () {
    const {children} = this.props

    const headers = Children.map(children,
      ({props: {id, title, active}}) => (
        <TabHeader key={id} href={'#' + id}>
          {title}
        </TabHeader>
      ))

    return (
      <div className='mdl-tabs mdl-js-tabs mdl-js-ripple-effect' ref='wrapper'>
        <div className='mdl-tabs__tab-bar'>
          {headers}
        </div>
        {children}
      </div>
    )
  }
})

export function Tab ({children, id}) {
  return (
    <div id={id} className='mdl-tabs__panel'>
      {children}
    </div>
  )
}

Tab.displayName = 'Tab-Content'
Tab.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}
