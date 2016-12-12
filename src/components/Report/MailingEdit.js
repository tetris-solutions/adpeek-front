import React from 'react'
import FormMixin from '../mixins/FormMixin'
import {Submit} from '../Button'
import Message from 'tetris-iso/Message'
import Select from '../Select'
import assign from 'lodash/assign'
import Switch from '../Switch'
import Input from '../Input'
import VerticalAlign from '../VerticalAlign'
import moment from 'moment'
import DatePicker from '../DatePicker'
import {createMailingReportAction} from '../../actions/create-mailing-action'
import {loadMailingListAction} from '../../actions/load-mailing-list'
import compact from 'lodash/compact'
import join from 'lodash/join'

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

const PeriodicitySelector = (props, {messages}) => (
  <div className='mdl-grid'>
    <div className='mdl-cell mdl-cell--6-col'>
      <Select
        label='periodicity'
        name='periodicity'
        value={props.periodicity}
        onChange={props.onChangePeriodicity}>
        <option value='daily'>{messages.daily}</option>
        <option value='weekly'>{messages.weekly}</option>
        <option value='monthly'>{messages.monthly}</option>
      </Select>
    </div>
    <div className='mdl-cell mdl-cell--6-col'>
      {props.periodicity === 'weekly' && (
        <Select
          label='dayOfWeek'
          name='day_of_week'
          value={props.day_of_week}
          onChange={props.onChangeDayOfWeek}>
          <option value='0'>{messages.sunday}</option>
          <option value='1'>{messages.monday}</option>
          <option value='2'>{messages.tuesday}</option>
          <option value='3'>{messages.wednesday}</option>
          <option value='4'>{messages.thursday}</option>
          <option value='5'>{messages.friday}</option>
          <option value='6'>{messages.saturday}</option>
        </Select>)}

      {props.periodicity === 'monthly' && (
        <Input
          label='dayOfMonth'
          name='day_of_month'
          type='number'
          value={props.day_of_month}
          onChange={props.onChangeDayOfMonth}
          min={1}
          max={31}/>)}
    </div>
  </div>
)
PeriodicitySelector.displayName = 'Periodicity'
PeriodicitySelector.propTypes = {
  day_of_week: PropTypes.number,
  day_of_month: PropTypes.number,
  date: PropTypes.string,
  periodicity: PropTypes.oneOf(['daily', 'weekly', 'montly']).isRequired,
  onChangePeriodicity: PropTypes.func.isRequired,
  onChangeDayOfWeek: PropTypes.func.isRequired,
  onChangeDayOfMonth: PropTypes.func.isRequired
}
PeriodicitySelector.contextTypes = {
  messages: PropTypes.object.isRequired
}

const MailingEdit = React.createClass({
  mixins: [FormMixin],
  propTypes: {
    params: PropTypes.object.isRequired,
    mailing: PropTypes.shape({
      id: PropTypes.string,
      date_range: PropTypes.oneOf(ranges),
      disabled: PropTypes.bool,
      schedule: PropTypes.shape({
        id: PropTypes.string,
        day_of_week: PropTypes.number,
        day_of_month: PropTypes.number,
        date: PropTypes.string
      }),
      emails: PropTypes.array,
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
    }).isRequired
  },
  contextTypes: {
    tree: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  },
  getInitialState () {
    let {mailing} = this.props

    if (mailing) {
      mailing = this.normalize(mailing)
    }

    return {mailing}
  },
  normalize (mailing) {
    mailing = assign({}, mailing)

    const schedule = mailing.schedule = assign({}, mailing.schedule)

    if (!schedule.date) {
      schedule.periodicity = 'daily'

      if (schedule.day_of_week) {
        schedule.periodicity = 'weekly'
      }

      if (schedule.day_of_month) {
        schedule.periodicity = 'monthly'
      }
    }

    return mailing
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
  onChangeRecurrent ({target: {checked}}) {
    this.changeSchedule(checked ? {
      day_of_week: 1,
      day_of_month: null,
      date: null
    } : {
      day_of_week: null,
      day_of_month: null,
      date: moment().add(1, 'day').format('YYYY-MM-DD')
    })
  },
  onChangeDate (momentDate) {
    this.changeSchedule({
      date: momentDate.format('YYYY-MM-DD')
    })
  },
  onChangePeriodicity ({target: {value: periodicity}}) {
    const changes = {periodicity}

    changes.day_of_week = null
    changes.day_of_month = null

    if (periodicity === 'weekly') {
      changes.day_of_week = 1
    }

    if (periodicity === 'monthly') {
      changes.day_of_month = 1
    }

    this.changeSchedule(changes)
  },
  onChangeInterval ({target: {value, name}}) {
    this.changeSchedule({[name]: Number(value)})
  },
  handleSubmit (e) {
    e.preventDefault()

    const {state: {mailing}, props: {params}, context: {router, tree}} = this
    const save = mailing.id ? false : createMailingReportAction

    function onCreate (response) {
      const path = compact([
        `company/${params.company}`,
        params.workspace && `workspace/${params.workspace}`,
        params.folder && `folder/${params.folder}`,
        `report/${params.report}`,
        `mailing/${response.data.id}`
      ])

      router.push('/' + join(path, '/'))
    }

    function onUpdate () {
      const path = compact([
        `company/${params.company}`,
        params.workspace && `workspace/${params.workspace}`,
        params.folder && `folder/${params.folder}`,
        params.report && `report/${params.report}`,
        'mailing'
      ])

      router.push('/' + join(path, '/'))
    }

    save(tree, params, mailing)
      .then(response => loadMailingListAction(tree, params)
        .then(() => response))
      .then(mailing.id ? onUpdate : onCreate)
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
              onChange={this.onChangeRecurrent}
              label={<Message>mailingRecurrentSwitch</Message>}/>
          </Middle>
        </div>

        {mailing.schedule.date ? (
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--12-col'>
              <DatePicker
                value={mailing.schedule.date}
                onChange={this.onChangeDate}/>
            </div>
          </div>
        ) : (
          <PeriodicitySelector
            {...mailing.schedule}
            onChangeDayOfMonth={this.onChangeInterval}
            onChangeDayOfWeek={this.onChangeInterval}
            onChangePeriodicity={this.onChangePeriodicity}/>
        )}

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
