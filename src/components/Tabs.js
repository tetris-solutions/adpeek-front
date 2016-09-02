import find from 'lodash/find'
import map from 'lodash/map'
import React from 'react'

const {Children, PropTypes} = React

function TabHeader ({children, switchTab, id, active}) {
  function onClick (e) {
    e.preventDefault()
    switchTab(id)
  }

  return (
    <a className={'mdl-tabs__tab' + (active ? ' is-active' : '')} href='' onClick={onClick}>
      {children}
    </a>
  )
}

TabHeader.displayName = 'Tab-Header'
TabHeader.propTypes = {
  active: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  switchTab: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

export const Tabs = React.createClass({
  displayName: 'Tabs',
  propTypes: {
    children: PropTypes.node.isRequired,
    onChangeTab: PropTypes.func
  },
  getInitialState () {
    return {
      activeTab: this.findActiveTab()
    }
  },
  componentWillReceiveProps (nextProps) {
    // abort if not in controlled mode
    if (!nextProps.onChangeTab) return

    const newActiveTab = this.findActiveTab(nextProps)

    if (newActiveTab !== this.state.activeTab) {
      this.setState({activeTab: newActiveTab})
    }
  },
  findActiveTab (props = this.props) {
    const children = Children.toArray(props.children)
    const activeOne = find(children, ({props: {active}}) => active) || children[0]

    return activeOne ? activeOne.props.id : null
  },
  switchTab (activeTab) {
    if (this.props.onChangeTab) {
      this.props.onChangeTab(activeTab)
    }
    this.setState({activeTab})
  },
  render () {
    const {activeTab} = this.state
    const children = Children.toArray(this.props.children)

    return (
      <div className='mdl-tabs is-upgraded' ref='wrapper'>
        <div className='mdl-tabs__tab-bar'>
          {map(children, ({props: {id, title}}) =>
            <TabHeader key={id} id={id} active={activeTab === id} switchTab={this.switchTab}>
              {title}
            </TabHeader>)}
        </div>

        {find(children,
          ({props: {id}}) => id === activeTab)}
      </div>
    )
  }
})

export function Tab ({children, id}) {
  return (
    <div id={id} className='mdl-tabs__panel is-active'>
      {children}
    </div>
  )
}

Tab.displayName = 'Tab-Content'
Tab.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
}
