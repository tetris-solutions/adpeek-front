import React from 'react'
import PropTypes from 'prop-types'
import {Button} from '../Button'
import Message from 'tetris-iso/Message'
import DateRangePicker from '../DateRangePicker'
import ButtonWithPrompt from 'tetris-iso/ButtonWithPrompt'

const calculateDateRanges = ({nextWeek, nextMonth, nextSemester, nextYear}) => ({
  [nextWeek]: {
    startDate (now) {
      return now.add(7, 'days').startOf('week')
    },
    endDate (now) {
      return now.add(7, 'days').endOf('week')
    }
  },
  [nextMonth]: {
    startDate (now) {
      return now.add(1, 'month').startOf('month')
    },
    endDate (now) {
      return now.add(1, 'month').endOf('month')
    }
  },
  [nextSemester]: {
    startDate (now) {
      const currMonth = now.month() + 1 // zero based

      return currMonth > 6 // is second semester
        ? now.add(1, 'year').month(0).startOf('month') // january 1
        : now.month(6).startOf('month') // july 1
    },
    endDate (now) {
      const currMonth = now.month() + 1

      return currMonth > 6
        ? now.add(1, 'year').month(5).endOf('month') // jun 30
        : now.month(11).endOf('month') // december 31
    }
  },
  [nextYear]: {
    startDate (now) {
      return now.endOf('year').add(1, 'days')
    },
    endDate (now) {
      return now.endOf('year').add(1, 'days').endOf('year')
    }
  }
})

let ranges

function DateRangeModal ({startDate, endDate, close, onChange}, {messages}) {
  ranges = ranges || calculateDateRanges(messages)

  return (
    <div className='mdl-grid'>
      <div className='mdl-cell mdl-cell--12-col'>
        <h4>
          <Message>orderRangeTitle</Message>
        </h4>

        <DateRangePicker
          ranges={ranges}
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
}

DateRangeModal.displayName = 'Date-Range-Modal'
DateRangeModal.propTypes = {
  onChange: PropTypes.func,
  close: PropTypes.func,
  startDate: PropTypes.object,
  endDate: PropTypes.object
}
DateRangeModal.contextTypes = {
  messages: PropTypes.object
}

function OrderDateRange ({startDate, endDate, onChange, buttonClassName}) {
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

OrderDateRange.displayName = 'Order-Date-Range'
OrderDateRange.propTypes = {
  buttonClassName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  startDate: PropTypes.object.isRequired,
  endDate: PropTypes.object.isRequired
}

export default OrderDateRange
