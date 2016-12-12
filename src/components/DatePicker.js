import React from 'react'
import {Calendar} from 'react-date-range'
import Tooltip from 'tetris-iso/Tooltip'
import Input from './Input'

const {PropTypes} = React

const DatePicker = (props, {moment}) => (
  <Input
    label='date'
    readOnly
    value={moment(props.value).format('DD/MM/YYYY')}>
    <Tooltip hover>
      <Calendar {...props}/>
    </Tooltip>
  </Input>
)

DatePicker.displayName = 'Date-Picker'
DatePicker.propTypes = {
  value: PropTypes.string
}
DatePicker.contextTypes = {
  moment: PropTypes.func.isRequired
}

export default DatePicker
