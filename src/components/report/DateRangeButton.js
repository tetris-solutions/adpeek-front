import React from 'react'
import PropTypes from 'prop-types'
import Message from '@tetris/front-server/Message'
import ButtonWithPrompt from '@tetris/front-server/ButtonWithPrompt'
import {Button} from '../Button'
import DateRangeForm from './DateRangeForm'

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

  render () {
    const {moment, reportParams: {from, to}} = this.context
    const {disabled, className} = this.props
    const startDate = moment(from)
    const endDate = moment(to)

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
        <DateRangeForm
          close={dismiss}
          save={this.context.changeDateRange}
          startDate={startDate}
          endDate={endDate}/>}
      </ButtonWithPrompt>
    )
  }
}

export default DateRangeButton
