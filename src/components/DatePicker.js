import React from 'react'
import PropTypes from 'prop-types'
import {Calendar} from 'react-date-range'
import Tooltip from 'tetris-iso/Tooltip'
import Input from './Input'

const DatePicker = (props, {moment}) => {
  const date = moment(props.value)

  return (
    <Input
      name={'__date__'}
      label='date'
      readOnly
      data-value={date.format('YYYY-MM-DD')}
      value={date.format('DD/MM/YYYY')}>
      <Tooltip hover>
        <Calendar {...props} date={date}/>
      </Tooltip>
    </Input>
  )
}

DatePicker.displayName = 'Date-Picker'
DatePicker.propTypes = {
  value: PropTypes.string
}
DatePicker.contextTypes = {
  moment: PropTypes.func.isRequired
}

export default DatePicker
