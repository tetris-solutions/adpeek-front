import React from 'react'
import PropTypes from 'prop-types'
import Select from '../../Select'
import Input from '../../Input'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'

function ProductScopeValue ({onChange, options, editable, value: inputValue, name}) {
  if (isEmpty(options)) {
    return (
      <Input
        required
        label='productPartitionValue'
        disabled={!editable}
        name={name}
        value={inputValue}
        onChange={onChange}/>
    )
  }

  return (
    <Select
      required
      label='productPartitionValue'
      disabled={!editable}
      name={name}
      value={inputValue}
      onChange={onChange}>
      <option/>
      {map(options, ({text, value}) =>
        <option key={value} value={value}>
          {text}
        </option>)}
    </Select>
  )
}

ProductScopeValue.displayName = 'Product-Scope-Value'
ProductScopeValue.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  editable: PropTypes.bool.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string.isRequired
}

export default ProductScopeValue
