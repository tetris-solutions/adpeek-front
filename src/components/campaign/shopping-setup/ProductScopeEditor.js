import React from 'react'
import PropTypes from 'prop-types'
import Select from '../../Select'
import map from 'lodash/map'
import filter from 'lodash/filter'
import ProductScopeValue from './ProductScopeValue'
import {productScopeTypes, inferOptionMsgName, inferMsgName} from './types'

const parseCategory = ({name: text, value}) => ({text, value})

class ProductScopeEditor extends React.PureComponent {
  static displayName = 'Product-Scope-Editor'

  static propTypes = {
    editable: PropTypes.bool,
    update: PropTypes.func,
    remove: PropTypes.func,
    categories: PropTypes.array.isRequired,
    id: PropTypes.number.isRequired,
    types: PropTypes.array.isRequired,
    parentScope: PropTypes.object,
    config: PropTypes.shape({
      scopeClass: PropTypes.string.isRequired,
      parent: PropTypes.string,
      valueField: PropTypes.string.isRequired,
      options: PropTypes.array
    }),
    type: PropTypes.string.isRequired,
    channel: PropTypes.string,
    channelExclusivity: PropTypes.string,
    condition: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  }

  static contextTypes = {
    messages: PropTypes.object
  }

  onChangeType = ({target: {value: type}}) => {
    const {update, config, id} = this.props
    const newConfig = productScopeTypes[type]

    update(id, {
      ProductDimensionType: newConfig.scopeClass,
      [newConfig.valueField]: null,
      [config.valueField]: null,
      type
    })
  }

  onChangeValue = ({target: {name, value}}) => {
    this.props.update(this.props.id, {[name]: value})
  }

  onClickRemove = e => {
    e.preventDefault()

    this.props.remove(this.props.id)
  }

  parseOption = value => {
    return {
      value,
      text: this.context.messages[inferOptionMsgName(value)]
    }
  }

  getOptions () {
    const {
      categories,
      parentScope,
      config: {valueField, options},
      type
    } = this.props

    if (options) {
      return map(options, this.parseOption)
    }

    const ls = parentScope ? filter(categories, {
      parent: parentScope[valueField],
      type
    }) : filter(categories, {type})

    return map(ls, parseCategory)
  }

  render () {
    const {messages} = this.context
    const {editable, type, types, config: {valueField}} = this.props
    const inputValue = this.props[valueField]

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--5-col'>
          <Select
            required
            disabled={!editable}
            name='type'
            value={type}
            onChange={this.onChangeType}>
            {map(types, ({type}) =>
              <option key={type} value={type}>
                {messages[inferMsgName(type)]}
              </option>)}
          </Select>
        </div>
        <div className='mdl-cell mdl-cell--5-col'>
          <ProductScopeValue
            onChange={this.onChangeValue}
            options={this.getOptions()}
            editable={editable}
            value={String(inputValue || '')}
            name={valueField}/>
        </div>
        <div className='mdl-cell mdl-cell--2-col'>
          <br/>
          {editable ? (
            <a href='' onClick={this.onClickRemove}>
              <i className='material-icons'>close</i>
            </a>
          ) : (
            <i className='material-icons' style={{cursor: 'not-allowed'}}>
              lock
            </i>
          )}
        </div>
      </div>
    )
  }
}

export default ProductScopeEditor
