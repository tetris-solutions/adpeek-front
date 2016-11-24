import React from 'react'
import Message from 'tetris-iso/Message'
import DateRangePicker from '../DateRangePicker'
import ButtonWithPrompt from 'tetris-iso/ButtonWithPrompt'
import {Button} from '../Button'

const {PropTypes} = React

const DateRangeSelector = ({startDate, endDate, close, onChange}) => (
  <div className='mdl-grid'>
    <div className='mdl-cell mdl-cell--12-col'>
      <h4>
        <Message>reportRangeTitle</Message>
      </h4>

      <DateRangePicker
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}/>

      <br/>
      <hr/>
      <Button className='mdl-button' onClick={close}>
        <Message>close</Message>
      </Button>
    </div>
  </div>
)

DateRangeSelector.displayName = 'Date-Range-Modal'
DateRangeSelector.propTypes = {
  onChange: PropTypes.func,
  close: PropTypes.func,
  startDate: PropTypes.object,
  endDate: PropTypes.object
}

function DateRangeButton ({disabled, className}, {moment, reportParams: {from, to}, changeDateRange}) {
  const startDate = moment(from)
  const endDate = moment(to)

  const label = (
    <Message startDate={startDate.format('ddd D, MMM')} endDate={endDate.format('ddd D, MMM - YYYY')}>
      dateRangeLabel
    </Message>
  )

  if (disabled) {
    return (
      <Button disabled className={className}>
        {label}
      </Button>
    )
  }

  return (
    <ButtonWithPrompt className={className} label={label} size='medium'>
      {({dismiss}) => (
        <DateRangeSelector
          close={dismiss}
          onChange={changeDateRange}
          startDate={startDate}
          endDate={endDate}/>)}
    </ButtonWithPrompt>
  )
}

DateRangeButton.displayName = 'Report-Date-Range'
DateRangeButton.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool
}
DateRangeButton.contextTypes = {
  moment: PropTypes.func.isRequired,
  reportParams: PropTypes.object.isRequired,
  changeDateRange: PropTypes.func.isRequired
}
export default DateRangeButton
