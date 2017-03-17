import React from 'react'
import {node} from './higher-order/branch'
import AutoSelect from './AutoSelect'
import get from 'lodash/get'
import map from 'lodash/map'
import find from 'lodash/find'

const Selector = React.createClass({
  displayName: 'S',
  propTypes: {
    placeholder: React.PropTypes.string,
    onChange: React.PropTypes.func,
    parent: React.PropTypes.string,
    list: React.PropTypes.string,
    params: React.PropTypes.object,
    account: React.PropTypes.shape({
      properties: React.PropTypes.array
    })
  },
  getDefaultProps () {
    return {
      onChange: () => false
    }
  },
  getInitialState () {
    return {selected: null}
  },
  normalize ({id: value, name: text}) {
    return {text, value}
  },
  componentWillReceiveProps (nextProps) {
    const {parent} = this.props

    if (nextProps.params[parent] !== this.props.params[parent]) {
      this.setState({selected: null})
    }
  },
  onChange (option) {
    const selected = option
      ? find(this.getProperties(), {id: option.value})
      : null

    this.setState({selected}, () =>
      this.props.onChange(selected))
  },
  getProperties () {
    const {parent, list} = this.props

    return get(this.props[parent], list, [])
  },
  render () {
    const {selected} = this.state

    return (
      <AutoSelect
        placeholder={this.props.placeholder}
        selected={selected ? this.normalize(selected) : null}
        onChange={this.onChange}
        options={map(this.getProperties(), this.normalize)}/>
    )
  }
})

const injectAccount = C => node('company', 'account', C)
const injectProperty = C => node('account', 'property', C)

const PropertySelector_ = injectAccount(Selector)

export const PropertySelector = (props, {messages}) =>
  <PropertySelector_
    {...props}
    parent='account'
    list='properties'
    placeholder={messages.gaPropertyLabel}/>

PropertySelector.displayName = 'Property-Selector'
PropertySelector.contextTypes = {
  messages: React.PropTypes.object
}

const ViewSelector_ = injectAccount(injectProperty(Selector))

export const ViewSelector = (props, {messages}) =>
  <ViewSelector_
    {...props}
    parent='property'
    list='views'
    placeholder={messages.gaViewLabel}/>

ViewSelector.displayName = 'View-Selector'
ViewSelector.contextTypes = {
  messages: React.PropTypes.object
}
