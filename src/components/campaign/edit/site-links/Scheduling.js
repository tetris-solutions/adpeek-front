import React from 'react'
import PropTypes from 'prop-types'
import DateRangePicker from '../../../DateRangePicker'

class Scheduling extends React.PureComponent {
  static displayName = 'Scheduling'

  static propTypes = {
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    onChangeRange: PropTypes.func.isRequired
  }

  static contextTypes = {
    moment: PropTypes.func.isRequired
  }

  render () {
    const {moment} = this.context
    const {startTime, endTime, onChangeRange} = this.props

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <DateRangePicker
            startDate={startTime ? moment(startTime) : undefined}
            endDate={endTime ? moment(endTime) : undefined}
            onChange={onChangeRange}/>
        </div>
      </div>
    )
  }
}

export default Scheduling
