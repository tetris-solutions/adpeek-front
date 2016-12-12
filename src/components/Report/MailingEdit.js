import React from 'react'
import FormMixin from '../mixins/FormMixin'
import {Submit} from '../Button'
import Message from 'tetris-iso/Message'
import Select from '../Select'
import assign from 'lodash/assign'
import Switch from '../Switch'
import VerticalAlign from '../VerticalAlign'
import moment from 'moment'

const {PropTypes} = React
const ranges = [
  'today',
  'yesterday',
  'last week',
  'last month',
  'last 30 days',
  'this month'
]

const NotFound = () => (
  <p className='mdl-color--red mdl-color-text--white'>
    Not found!
  </p>
)
const Middle = ({className, children}) => (
  <VerticalAlign className={className}>
    <div>{children}</div>
  </VerticalAlign>
)

Middle.displayName = 'Middle'
Middle.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

const RangeSelect = ({value, onChange}, {messages}) => (
  <Select name='date_range' label='mailingRange' value={value} onChange={onChange}>
    <option value='today'>{messages.today}</option>
    <option value='yesterday'>{messages.yesterday}</option>
    <option value='last week'>{messages.pastWeek}</option>
    <option value='last month'>{messages.pastMonth}</option>
    <option value='last 30 days'>{messages.last30Days}</option>
    <option value='this month'>{messages.currentMonth}</option>
  </Select>
)

RangeSelect.displayName = 'Range-Select'
RangeSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
}
RangeSelect.contextTypes = {
  messages: PropTypes.object
}

const MailingEdit = React.createClass({
  mixins: [FormMixin],
  propTypes: {
    mailing: PropTypes.shape({
      id: PropTypes.string,
      date_range: PropTypes.oneOf(ranges),
      disabled: PropTypes.bool,
      schedule: PropTypes.shape({
        id: PropTypes.string,
        day_of_week: PropTypes.number,
        day_of_month: PropTypes.number,
        timestamp: PropTypes.string
      }),
      report: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
      }),
      workspace: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
      }),
      folder: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
      })
    })
  },
  getInitialState () {
    return {mailing: this.props.mailing}
  },
  change (changes) {
    const mailing = assign({}, this.state.mailing, changes)

    this.setState({mailing})
  },
  changeSchedule (sChanges) {
    const schedule = assign({}, this.state.mailing.schedule, sChanges)

    this.change({schedule})
  },
  onChangeRange ({target: {value: date_range}}) {
    this.change({date_range})
  },
  onChangeDisabled ({target: {checked}}) {
    this.change({disabled: !checked})
  },
  onChangePeriodic ({target: {checked}}) {
    this.changeSchedule(checked ? {
      day_of_week: 0,
      day_of_month: null,
      date: null
    } : {
      day_of_week: null,
      day_of_month: null,
      date: moment().add(1, 'day').format('YYYY-MM-DD')
    })
  },
  handleSubmit (e) {
    e.preventDefault()
  },
  render () {
    const {mailing} = this.state

    if (!mailing) {
      return <NotFound/>
    }

    return (
      <form onSubmit={this.handleSubmit}>

        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--4-col'>
            <RangeSelect
              value={mailing.date_range}
              onChange={this.onChangeRange}/>
          </div>
          <Middle className='mdl-cell mdl-cell--4-col'>
            <Switch
              checked={!mailing.disabled}
              onChange={this.onChangeDisabled}
              label={<Message>mailingEnabledSwitch</Message>}/>
          </Middle>
          <Middle className='mdl-cell mdl-cell--4-col'>
            <Switch
              checked={!mailing.disabled}
              onChange={this.onChangePeriodic}
              label={<Message>mailingRecurrentSwitch</Message>}/>
          </Middle>
        </div>

        <hr/>
        <Submit className='mdl-button'>
          <Message>save</Message>
        </Submit>

        <pre>
          {JSON.stringify(mailing, null, 2)}
        </pre>
      </form>
    )
  }
})

export default MailingEdit
