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
  componentWillReceiveProps ({account}) {
    if (account !== this.props.account) {
      this.setState({selected: null})
    }
  },
  onChange (selection) {
    const id = selection ? selection.value : null

    this.setState({
      selected: id
        ? find(this.getProperties(), {id})
        : null
    }, () => this.props.onChange(id))
  },
  getProperties () {
    return get(this.props.account, 'properties', [])
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

const PropertySelector_ = node('company', 'account', Selector)

export const PropertySelector = (props, {messages}) =>
  <PropertySelector_ {...props} placeholder={messages.gaPropertyLabel}/>

PropertySelector.displayName = 'Property-Selector'
PropertySelector.contextTypes = {
  messages: React.PropTypes.object
}
