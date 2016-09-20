import React from 'react'
import Message from '@tetris/front-server/lib/components/intl/Message'
import DateRange from './DateRange'
import Modal from './Modal'

const {PropTypes} = React

const DateRangeModal = ({startDate, endDate, close, onChange}) => (
  <Modal onEscPress={close}>
    <h4>
      <Message>reportRangeTitle</Message>
    </h4>

    <DateRange
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}/>

    <button className='mdl-button' onClick={close}>
      <Message>close</Message>
    </button>
  </Modal>
)

DateRangeModal.displayName = 'Date-Range-Modal'
DateRangeModal.propTypes = {
  onChange: PropTypes.func,
  close: PropTypes.func,
  startDate: PropTypes.object,
  endDate: PropTypes.object
}

const ReportDateRange = React.createClass({
  displayName: 'Report-Date-Range',
  getInitialState () {
    return {isModalOpen: false}
  },
  propTypes: {
    buttonClassName: PropTypes.string,
    onChange: PropTypes.func,
    startDate: PropTypes.object,
    endDate: PropTypes.object
  },
  openModal () {
    this.setState({isModalOpen: true})
  },
  closeModal () {
    this.setState({isModalOpen: false})
  },
  render () {
    const {startDate, endDate, onChange, buttonClassName} = this.props

    return (
      <button type='button' className={buttonClassName} onClick={this.openModal}>
        <Message startDate={startDate.format('ddd D, MMM')} endDate={endDate.format('ddd D, MMM - YYYY')}>
          dateRangeLabel
        </Message>

        {this.state.isModalOpen ? (
          <DateRangeModal
            close={this.closeModal}
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}/>
        ) : null}
      </button>
    )
  }
})

export default ReportDateRange
