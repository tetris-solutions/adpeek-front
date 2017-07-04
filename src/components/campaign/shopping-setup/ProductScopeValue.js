import React from 'react'
import PropTypes from 'prop-types'
import Select from '../../Select'
import Input from '../../Input'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'

function ProductScopeValue ({categories, onChange, options, editable, value: inputValue, name}) {
  if (options) {
    return (
      <Select required disabled={!editable} name={name} value={inputValue} onChange={onChange}>
        <option/>
        {map(options, value =>
          <option key={value} value={value}>
            {value}
          </option>)}
      </Select>
    )
  }

  if (isEmpty(categories)) {
    return (
      <Input
        required
        disabled={!editable}
        name={name}
        value={inputValue}
        onChange={onChange}/>
    )
  }

  return (
    <Select required disabled={!editable} name={name} value={inputValue} onChange={onChange}>
      <option/>
      {map(categories, ({name, value}) =>
        <option key={value} value={value}>
          {name}
        </option>)}
    </Select>
  )
}

ProductScopeValue.displayName = 'Product-Scope-Value'
ProductScopeValue.propTypes = {
  categories: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  editable: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

export default ProductScopeValue
