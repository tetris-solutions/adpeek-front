import React from 'react'
import PropTypes from 'prop-types'
import set from 'lodash/set'
import concat from 'lodash/concat'
import filter from 'lodash/filter'
import {randomString} from '../../../../functions/random-string'

class NewFeedItem extends React.Component {
  static propTypes = {
    feedId: PropTypes.string,
    folder: PropTypes.object,
    cancel: PropTypes.func,
    onSubmit: PropTypes.func,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    campaign: PropTypes.object
  }

  static contextTypes = {
    moment: PropTypes.func
  }

  onChangeText = ({target: {name, value}}) => {
    this.setState(set(this.state, name, value))
  }

  onChangeRange = ({startDate, endDate}) => {
    this.setState({
      startTime: startDate
        ? startDate.format('YYYY-MM-DD')
        : null,
      endTime: endDate
        ? endDate.format('YYYY-MM-DD')
        : null
    })
  }

  addSchedule = () => {
    this.setState({
      scheduling: concat(this.state.scheduling, {
        id: randomString(),
        dayOfWeek: 'ALL_WEEK',
        startHour: '0',
        startMinute: 'ZERO',
        endHour: '0',
        endMinute: 'ZERO'
      })
    })
  }

  removeSchedule = rmIndex => {
    this.setState({
      scheduling: filter(this.state.scheduling, (_, index) => index !== rmIndex)
    })
  }
}

export default NewFeedItem
