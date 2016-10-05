import React from 'react'
import {DateRange} from 'react-date-range'

const {PropTypes} = React

const calculateRanges = ({today, yesterday, pastWeek, currentMonth, pastMonth}) => ({
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
  }
})
let defaultRanges

const DateRangePicker = (props, {messages}) => {
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