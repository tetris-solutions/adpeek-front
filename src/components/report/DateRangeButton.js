import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import DateRangePicker from '../DateRangePicker'
import ButtonWithPrompt from 'tetris-iso/ButtonWithPrompt'
import {Button} from '../Button'

class DateRangeSelector extends React.Component {
  static displayName = 'Date-Range-Modal'
  static propTypes = {
    onClose: PropTypes.func,
    onChange: PropTypes.func,
    close: PropTypes.func,
    startDate: PropTypes.object,
    endDate: PropTypes.object
  }

  componentWillUnmount () {
    this.props.onClose()
  }

  render () {
    const {startDate, endDate, close, onChange} = this.props

    return (
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
          <Button className='mdl-button' onClick={close}>
            <Message>close</Message>
          </Button>
        </div>
      </div>
    )
  }
}

class DateRangeButton extends React.Component {
  static displayName = 'Report-Date-Range'
  static propTypes = {
    className: PropTypes.string.isRequired,
    disabled: PropTypes.bool
  }
  static contextTypes = {
    moment: PropTypes.func.isRequired,
    reportParams: PropTypes.object.isRequired,
    changeDateRange: PropTypes.func.isRequired
  }

  state = {
    startDate: this.context.moment(this.context.reportParams.from),
    endDate: this.context.moment(this.context.reportParams.to)
  }

  onChange = ({startDate, endDate}) => {
    this.setState({startDate, endDate})
  }

  save = () => {
    this.context.changeDateRange(this.state)
  }

  render () {
    const {startDate, endDate} = this.state
    const {disabled, className} = this.props

    const label = (
      <Message startDate={startDate.format('ddd D, MMM')} endDate={endDate.format('ddd D, MMM - YYYY')}>
        dateRangeLabel
      </Message>
    )

    if (disabled) {
      return (
        <Button disabled className={className}>
          {label}
        </Button>
      )
    }

    return (
      <ButtonWithPrompt className={className} label={label} size='medium'>{({dismiss}) =>
        <DateRangeSelector
          onClose={this.save}
          close={dismiss}
          onChange={this.onChange}
          startDate={startDate}
          endDate={endDate}/>}
      </ButtonWithPrompt>
    )
  }
}

export default DateRangeButton
