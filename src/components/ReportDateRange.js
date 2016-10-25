import React from 'react'
import Message from 'tetris-iso/Message'
import DateRangePicker from './DateRangePicker'
import ButtonWithPrompt from './ButtonWithPrompt'

const {PropTypes} = React

const DateRangeModal = ({startDate, endDate, close, onChange}) => (
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
      <button className='mdl-button' onClick={close}>
        <Message>close</Message>
      </button>
    </div>
  </div>
)

DateRangeModal.displayName = 'Date-Range-Modal'
DateRangeModal.propTypes = {
  onChange: PropTypes.func,
  close: PropTypes.func,
  startDate: PropTypes.object,
  endDate: PropTypes.object
}

function ReportDateRange ({startDate, endDate, onChange, buttonClassName}) {
  const label = (
    <Message startDate={startDate.format('ddd D, MMM')} endDate={endDate.format('ddd D, MMM - YYYY')}>
      dateRangeLabel
    </Message>
  )

  return (
    <ButtonWithPrompt className={buttonClassName} label={label} size='medium'>
      {({dismiss}) => (
        <DateRangeModal
          close={dismiss}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}/>
      )}
    </ButtonWithPrompt>
  )
}

ReportDateRange.displayName = 'Report-Date-Range'
ReportDateRange.propTypes = {
  buttonClassName: PropTypes.string,
  onChange: PropTypes.func,
  startDate: PropTypes.object,
  endDate: PropTypes.object
}

export default ReportDateRange
