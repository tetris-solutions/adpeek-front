import React from 'react'
import PropTypes from 'prop-types'
import Select from '../../../Select'

function TypeSelect ({onChange, value}, {messages}) {
  return (
    <Select label='moduleType' name='type' onChange={onChange} value={value}>
      <option value='column'>
        {messages.columnChart}
      </option>
      <option value='line'>
        {messages.lineChart}
      </option>
      <option value='pie'>
        {messages.pieChart}
      </option>
      <option value='table'>
        {messages.table}
      </option>
      <option value='total'>
        {messages.totalChart}
      </option>
    </Select>
  )
}

TypeSelect.displayName = 'Type-Select'
TypeSelect.contextTypes = {
  messages: PropTypes.object
}
TypeSelect.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string
}

export default TypeSelect
