import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import Select from '../../Select'
import ProductScopeValue from './ProductScopeValue'
import {productScopeTypes, inferMsgName} from './types'

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

export default DimensionEditor
