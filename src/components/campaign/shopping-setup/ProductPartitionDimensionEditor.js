import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import Select from '../../Select'
import ProductScopeValue from './ProductScopeValue'
import {productScopeTypes, inferMsgName} from './types'

class DimensionEditor extends React.PureComponent {
  static displayName = ' Dimension-Editor'

  static propTypes = {
    title: PropTypes.node.isRequired,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.any.isRequired,
    name: PropTypes.any.isRequired
  }

  static contextTypes = {
    messages: PropTypes.object
  }

  render () {
    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <h5>{this.props.title}</h5>
        </div>
        <div className='mdl-cell mdl-cell--12-col'>
          <Select name='type' label='productPartitionType' onChange={this.props.onChange} value={this.props.type}>
            {map(productScopeTypes, (_, type) =>
              <option key={type} value={type}>
                {this.context.messages[inferMsgName(type)]}
              </option>)}
          </Select>
        </div>
        <div className='mdl-cell mdl-cell--12-col'>
          <ProductScopeValue
            editable
            onChange={this.props.onChange}
            options={this.props.options}
            value={this.props.value}
            name={this.props.name}/>
        </div>
      </div>
    )
  }
}

export default DimensionEditor
