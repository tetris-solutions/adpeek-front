import React from 'react'
import {Link} from 'react-router'
import find from 'lodash/find'
import map from 'lodash/map'
import cx from 'classnames'
import PropTypes from 'prop-types'
import qs from 'query-string'
import assign from 'lodash/assign'
import head from 'lodash/head'

class TabHeader extends React.PureComponent {
  static displayName = 'Tab-Header'
  static propTypes = {
    id: PropTypes.string,
    children: PropTypes.node,
    active: PropTypes.bool,
    select: PropTypes.func
  }

  onClick = e => {
    e.preventDefault()

    this.props.select(this.props.id)
  }

  render () {
    const {children, active} = this.props

    return (
      <a className={cx({'mdl-tabs__tab': true, 'is-active': active})} href='' onClick={this.onClick}>
        {children}
      </a>
    )
  }
}

const TabLink = ({active, children, param, id, location: {pathname, query}}) => (
  <Link
    className={cx({'mdl-tabs__tab': true, 'is-active': active})}
    to={`${pathname}?${qs.stringify(assign(query, {[param]: id}))}`}>
    {children}
  </Link>
)

TabLink.displayName = 'Tab-Link'
TabLink.propTypes = {
  id: PropTypes.string,
  active: PropTypes.bool,
  children: PropTypes.node,
  param: PropTypes.string,
  location: PropTypes.object
}

const tabHeaders = {
  navigation: TabLink,
  controlled: TabHeader,
  state: TabHeader
}

export class Tabs extends React.Component {
  static displayName = 'Tabs'

  static propTypes = {
    children: PropTypes.node.isRequired,
    param: PropTypes.string,
    onChangeTab: PropTypes.func
  }

  static contextTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string,
      query: PropTypes.object
    })
  }

  mode = this.props.param
    ? 'navigation'
    : this.props.onChangeTab
      ? 'controlled'
      : 'state'

  state = {
    activeTab: this.mode === 'state'
      ? this.findActiveTabFromChildren()
      : null
  }

  findActiveTabFromChildren (props = this.props) {
    const children = React.Children.toArray(props.children)
    const activeOne = find(children, ({props: {active}}) => active) || head(children)

    return activeOne ? activeOne.props.id : null
  }

  selectTab = (activeTab) => {
    switch (this.mode) {
      case 'state':
        this.setState({activeTab})
        break
      case 'controlled':
        this.props.onChangeTab(activeTab)
        break
    }
  }

  currentTab () {
    switch (this.mode) {
      case 'state':
        return this.state.activeTab
      case 'children':
        return this.findActiveTabFromChildren()
      case 'navigation':
        return this.context.location.query[this.props.param] || this.findActiveTabFromChildren()
    }
  }

  render () {
    const {location} = this.context
    const {children: rawChildren, param} = this.props
    const activeTab = this.currentTab()
    const children = React.Children.toArray(rawChildren)
    const Header = tabHeaders[this.mode]

    return (
      <div className='mdl-tabs is-upgraded' ref='wrapper'>
        <div className='mdl-tabs__tab-bar'>
          {map(children, ({props: {id, title}}) =>
            <Header key={id} {...{
              id,
              param,
              location,
              active: activeTab === id,
              select: this.selectTab
            }}>
              {title}
            </Header>)}
        </div>

        {find(children, ({props: {id}}) => id === activeTab)}
      </div>
    )
  }
}

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
