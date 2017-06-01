import React from 'react'
import PropTypes from 'prop-types'
import DateRangePicker from '../../../DateRangePicker'
import memoize from 'lodash/memoize'

const calculateDateRanges = memoize(({nextWeek, nextMonth, nextSemester, nextYear}) => ({
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
}))

class Period extends React.PureComponent {
  static displayName = 'Period'

  static propTypes = {
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    onChangeRange: PropTypes.func.isRequired
  }

  static contextTypes = {
    moment: PropTypes.func.isRequired,
    messages: PropTypes.object.isRequired
  }

  render () {
    const {moment, messages} = this.context
    const {startTime, endTime, onChangeRange} = this.props

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <DateRangePicker
            ranges={calculateDateRanges(messages)}
            startDate={startTime ? moment(startTime) : undefined}
            endDate={endTime ? moment(endTime) : undefined}
            onChange={onChangeRange}/>
        </div>
      </div>
    )
  }
}

export default Period
