import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import {Node, Tree} from '../../Tree'
import map from 'lodash/map'
import find from 'lodash/find'
import filter from 'lodash/filter'
import get from 'lodash/get'
import Select from '../../Select'
import ProductScopeValue from './ProductScopeValue'
import isEmpty from 'lodash/isEmpty'
import {productScopeTypes, inferMsgName, inferOptionMsgName} from './types'

const parseCategory = ({name: text, value}) => ({text, value})

class DimensionEditor extends React.PureComponent {
  static displayName = ' Dimension-Editor'

  static propTypes = {
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    editable: PropTypes.bool.isRequired,
    value: PropTypes.any.isRequired,
    name: PropTypes.any.isRequired
  }

  static contextTypes = {
    messages: PropTypes.object
  }

  render () {
    const {onChange, options, editable, value, name, type} = this.props

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--5-col'>
          <Select name='type' onChange={onChange} value={type} disabled={!editable}>
            {map(productScopeTypes, (_, type) =>
              <option key={type} value={type}>
                {this.context.messages[inferMsgName(type)]}
              </option>)}
          </Select>
        </div>
        <div className='mdl-cell mdl-cell--5-col'>
          <ProductScopeValue
            onChange={onChange}
            options={options}
            editable={editable}
            value={value}
            name={name}/>
        </div>
      </div>
    )
  }
}

class PartitionBranch extends React.Component {
  static displayName = 'Partition-Branch'
  static propTypes = {
    update: PropTypes.func.isRequired,
    children: PropTypes.object,
    parent: PropTypes.object,
    categories: PropTypes.array,
    dimension: PropTypes.shape({
      id: PropTypes.string,
      ProductDimensionType: PropTypes.string,
      type: PropTypes.string,
      channel: PropTypes.string,
      channelExclusivity: PropTypes.string,
      condition: PropTypes.string,
      value: PropTypes.any
    })
  }

  static contextTypes = {
    messages: PropTypes.object
  }

  isRoot () {
    return !this.props.parent
  }

  isCategory () {
    return (
      this.props.dimension &&
      this.props.dimension.ProductDimensionType === 'ProductBiddingCategory' &&
      this.props.dimension.value !== null
    )
  }

  getTypeConfig = () => {
    return productScopeTypes[this.props.dimension.type]
  }

  inferLabel () {
    if (this.isRoot()) {
      return <Message>rootPartitionLabel</Message>
    }

    const {categories, dimension} = this.props

    if (this.isCategory()) {
      const category = find(categories, {value: Number(dimension.value)})

      return get(category, 'name', dimension.value)
    }

    const {messages} = this.context
    const {valueField} = this.getTypeConfig()
    const config = this.getTypeConfig()
    const typeName = messages[inferMsgName(dimension.type)]

    let value = dimension[valueField]

    if (value === null) {
      return <Message>otherProducts</Message>
    }

    if (config.options) {
      value = messages[inferOptionMsgName(value)]
    }

    value = value || '---'

    return `${typeName}: ${value}`
  }

  parseOption = value => {
    return {
      value,
      text: this.context.messages[inferOptionMsgName(value)]
    }
  }

  getOptions () {
    if (this.isRoot()) {
      return []
    }

    const config = this.getTypeConfig()

    if (!this.isCategory()) {
      return map(config.options, this.parseOption)
    }

    const type = this.props.dimension.type
    const parentValue = get(this.props, 'parent.dimension.value')
    const parent = parentValue ? Number(parentValue) : null

    return map(
      filter(this.props.categories, {type, parent}),
      parseCategory
    )
  }

  onChange = ({target: {name, value}}) => {
    const changes = {[name]: value}

    if (name === 'type') {
      changes.ProductDimensionType = productScopeTypes[value].scopeClass
      changes.value = ''
    }

    this.props.update(this.props, changes)
  }

  render () {
    const {dimension, children} = this.props
    let editor = null

    if (!this.isRoot()) {
      const {valueField} = this.getTypeConfig()

      editor = (
        <DimensionEditor
          type={dimension.type}
          onChange={this.onChange}
          options={this.getOptions()}
          editable={!this.isCategory() || isEmpty(children)}
          value={dimension[valueField]}
          name={valueField}/>
      )
    }

    return (
      <Node label={this.inferLabel()}>
        {editor}
        <Tree>
          {map(children, partition =>
            <PartitionBranch
              key={partition.id}
              {...this.props}
              {...partition}/>)}
        </Tree>
      </Node>
    )
  }
}

export default PartitionBranch
