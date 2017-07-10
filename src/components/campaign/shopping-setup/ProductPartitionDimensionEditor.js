import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import Select from '../../Select'
import Input from '../../Input'
import ProductScopeValue from './ProductScopeValue'
import {productScopeTypes, inferMsgName} from './types'

class DimensionEditor extends React.PureComponent {
  static displayName = ' Dimension-Editor'

  static propTypes = {
    title: PropTypes.node.isRequired,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.any,
    name: PropTypes.any.isRequired,
    isUnit: PropTypes.bool.isRequired,
    cpc: PropTypes.number,
    isOther: PropTypes.bool.isRequired
  }

  static contextTypes = {
    messages: PropTypes.object
  }

  render () {
    const {isOther, title, onChange, type, isUnit, options, value, name, cpc} = this.props

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <h5>{title}</h5>
        </div>

        {!isOther && (
          <div className='mdl-cell mdl-cell--12-col'>
            <Select name='type' label='productPartitionType' onChange={onChange} value={type}>
              {map(productScopeTypes, (_, type) =>
                <option key={type} value={type}>
                  {this.context.messages[inferMsgName(type)]}
                </option>)}
            </Select>
          </div>)}

        {!isOther && (
          <div className='mdl-cell mdl-cell--12-col'>
            <ProductScopeValue
              editable
              onChange={onChange}
              options={options}
              value={value}
              name={name}/>
          </div>)}

        {isUnit && (
          <div className='mdl-cell mdl-cell--12-col'>
            <Input
              type='number'
              format='currency'
              value={cpc || ''}
              onChange={onChange}
              name='cpc'
              label='cpcBid'/>
          </div>)}
      </div>
    )
  }
}

export default DimensionEditor
