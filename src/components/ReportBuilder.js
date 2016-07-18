import React from 'react'
import Message from '@tetris/front-server/lib/components/intl/Message'
import DateRange from './DateRange'
import moment from 'moment'

export const ReportBuilder = React.createClass({
  displayName: 'Report-Builder',
  getInitialState () {
    return {
      startDate: moment().startOf('week').subtract(7, 'days'),
      endDate: moment().startOf('week').subtract(1, 'days')
    }
  },
  onChangeRange ({startDate, endDate}) {
    this.setState({startDate, endDate})
  },
  render () {
    const {startDate, endDate} = this.state

    return (
      <div>
        <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
            <Message>reportBuilder</Message>
            <div className='mdl-layout-spacer'/>
            <button>
              {startDate.format('ddd D, MMM') + ' <-> ' + endDate.format('ddd D, MMM - YYYY')}
            </button>
          </div>
        </header>

        <DateRange
          onChange={this.onChangeRange}
          startDate={startDate}
          endDate={endDate}/>
      </div>
    )
  }
})

export default ReportBuilder
