import React from 'react'
import PropTypes from 'prop-types'
import {DateRange} from 'react-date-range'

const calculateRanges = ({today, yesterday, pastWeek, currentMonth, pastMonth, last30Days}) => ({
  [today]: {
    startDate (now) {
      return now
    },
    endDate (now) {
      return now
    }
  },
  [yesterday]: {
    startDate (now) {
      return now.subtract(1, 'day')
    },
    endDate (now) {
      return now.subtract(1, 'day')
    }
  },
  [pastWeek]: {
    startDate (now) {
      return now.startOf('week').subtract(7, 'days')
    },
    endDate (now) {
      return now.startOf('week').subtract(1, 'days')
    }
  },
  [currentMonth]: {
    startDate (now) {
      return now.startOf('month')
    },
    endDate (now) {
      return now
    }
  },
  [pastMonth]: {
    startDate (now) {
      return now.subtract(1, 'month').startOf('month')
    },
    endDate (now) {
      return now.subtract(1, 'month').endOf('month')
    }
  },
  [last30Days]: {
    startDate (now) {
      return now.subtract(31, 'days')
    },
    endDate (now) {
      return now.subtract(1, 'day')
    }
  }
})
let defaultRanges

function DateRangePicker (props, {messages}) {
  defaultRanges = defaultRanges || calculateRanges(messages)

  return (
    <DateRange {...props} ranges={props.ranges || defaultRanges}/>
  )
}

DateRangePicker.displayName = 'Date-Range-Picker'
DateRangePicker.propTypes = {
  ranges: PropTypes.object,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  onChange: PropTypes.func.isRequired
}
DateRangePicker.contextTypes = {
  messages: PropTypes.object
}

export default DateRangePicker
