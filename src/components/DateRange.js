import React from 'react'
import {DateRange as DTRangePicker} from 'react-date-range'

const {PropTypes} = React

const DateRange = React.createClass({
  displayName: 'Date-Range',
  contextTypes: {
    messages: PropTypes.object
  },
  propTypes: {
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    onChange: PropTypes.func.isRequired
  },
  componentWillMount () {
    const {
      messages: {
        today,
        yesterday,
        pastWeek,
        currentMonth,
        pastMonth
      }
    } = this.context

    this.ranges = {
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
    }
  },
  render () {
    const {startDate, endDate, onChange} = this.props

    return <DTRangePicker startDate={startDate} endDate={endDate} onChange={onChange} ranges={this.ranges}/>
  }
})

export default DateRange
