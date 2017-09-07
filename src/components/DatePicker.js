import React from 'react'
import PropTypes from 'prop-types'
import {Calendar} from 'react-date-range'
import Tooltip from '@tetris/front-server/Tooltip'
import Input from './Input'

const DatePicker = (props, {moment}) => {
  const date = props.value ? moment(props.value) : undefined

  return (
    <Input
      name={'__date__'}
      label={props.label || 'date'}
      readOnly
      data-value={date ? date.format('YYYY-MM-DD') : ''}
      value={date ? date.format('DD/MM/YYYY') : ''}>
      <Tooltip hover>
        <Calendar {...props} date={date}/>
      </Tooltip>
    </Input>
  )
}

DatePicker.displayName = 'Date-Picker'
DatePicker.propTypes = {
  label: PropTypes.node,
  value: PropTypes.string
}
DatePicker.contextTypes = {
  moment: PropTypes.func.isRequired
}

export default DatePicker
