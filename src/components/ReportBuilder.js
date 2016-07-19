import React from 'react'
import Message from '@tetris/front-server/lib/components/intl/Message'
import DateRange from './DateRange'
import moment from 'moment'
import Modal from './Modal'

export const ReportBuilder = React.createClass({
  displayName: 'Report-Builder',
  getInitialState () {
    return {
      isModalOpen: false,
      startDate: moment().startOf('week').subtract(7, 'days'),
      endDate: moment().startOf('week').subtract(1, 'days')
    }
  },
  onChangeRange ({startDate, endDate}) {
    this.setState({startDate, endDate})
  },
  openModal () {
    this.setState({isModalOpen: true})
  },
  closeModal () {
    this.setState({isModalOpen: false})
  },
  render () {
    const {isModalOpen, startDate, endDate} = this.state

    return (
      <div>
        <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
            <Message>reportBuilder</Message>
            <div className='mdl-layout-spacer'/>
            <button className='mdl-button mdl-color-text--grey-100' onClick={this.openModal}>
              <Message startDate={startDate.format('ddd D, MMM')} endDate={endDate.format('ddd D, MMM - YYYY')}>
                dateRangeLabel
              </Message>
            </button>
          </div>
        </header>

        {isModalOpen && (
          <Modal provide={['messages', 'locales']}>
            <h4>
              <Message>reportRangeTitle</Message>
            </h4>

            <DateRange
              messages={this.context.messages}
              onChange={this.onChangeRange}
              startDate={startDate}
              endDate={endDate}/>

            <button onClick={this.closeModal}>
              close
            </button>
          </Modal>
        )}
      </div>
    )
  }
})

export default ReportBuilder
