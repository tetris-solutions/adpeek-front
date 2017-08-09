import React from 'react'
import PropTypes from 'prop-types'
import {routeParamsBasedBranch} from '../higher-order/branch'
import AutoSuggest from '../AutoSuggest'
import get from 'lodash/get'
import map from 'lodash/map'
import find from 'lodash/find'

class Selector extends React.Component {
  static displayName = 'GA-Field-Selector'

  static propTypes = {
    placeholder: PropTypes.string,
    selected: PropTypes.object,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    parent: PropTypes.string,
    list: PropTypes.string,
    params: PropTypes.object,
    account: PropTypes.shape({
      properties: PropTypes.array
    })
  }

  static defaultProps = {
    onChange: () => false,
    selected: null,
    disabled: false
  }

  state = {
    selected: this.props.selected
  }

  normalize = ({id: value, name: text}) => {
    return {text, value}
  }

  componentWillReceiveProps (nextProps) {
    const {parent} = this.props

    if (nextProps.params[parent] !== this.props.params[parent]) {
      this.setState({selected: null})
    }
  }

  onChange = (option) => {
    const selected = option
      ? find(this.getProperties(), {id: option.value})
      : null

    this.setState({selected}, () =>
      this.props.onChange(selected))
  }

  getProperties = () => {
    const {parent, list} = this.props

    return get(this.props[parent], list, [])
  }

  render () {
    const {selected} = this.state
    const {placeholder, disabled} = this.props

    return (
      <AutoSuggest
        disabled={disabled}
        placeholder={placeholder}
        selected={selected ? this.normalize(selected) : null}
        onChange={this.onChange}
        options={map(this.getProperties(), this.normalize)}/>
    )
  }
}

const injectAccount = C => routeParamsBasedBranch('company', 'account', C)
const injectProperty = C => routeParamsBasedBranch('account', 'property', C)

const PropertySelector_ = injectAccount(Selector)

export const PropertySelector = (props, {messages}) =>
  <PropertySelector_
    {...props}
    parent='account'
    list='properties'
    placeholder={messages.gaPropertyLabel}/>

PropertySelector.displayName = 'Property-Selector'
PropertySelector.contextTypes = {
  messages: PropTypes.object
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
  messages: PropTypes.object
}
