import React from 'react'
import PropTypes from 'prop-types'
import Select from '../../Select'
import map from 'lodash/map'
import camelCase from 'lodash/camelCase'
import filter from 'lodash/filter'
import ProductScopeValue from './ProductScopeValue'

const inferMsgName = type => camelCase(`PRODUCT_${type}`)

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

    update(id, {
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

  getEnabledCategories () {
    const {
      categories,
      parentScope,
      config: {valueField},
      type
    } = this.props

    return parentScope ? filter(categories, {
      parent: Number(parentScope[valueField]),
      type
    }) : filter(categories, {type})
  }

  render () {
    const {messages} = this.context
    const {editable, type, types, config: {options, valueField}} = this.props
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
            categories={this.getEnabledCategories()}
            onChange={this.onChangeValue}
            options={options}
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
