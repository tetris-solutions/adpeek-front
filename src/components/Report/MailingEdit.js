import React from 'react'
import {Link} from 'react-router'
import FormMixin from '../mixins/FormMixin'
import {Submit, Button} from '../Button'
import {Form, Header, Footer, Content} from '../Card'
import Message from 'tetris-iso/Message'
import Select from '../Select'
import assign from 'lodash/assign'
import Switch from '../Switch'
import Input from '../Input'
import VerticalAlign from '../VerticalAlign'
import moment from 'moment'
import DatePicker from '../DatePicker'
import {createMailingReportAction} from '../../actions/create-mailing-action'
import {updateMailingReportAction} from '../../actions/update-mailing-action'
import {pushSuccessMessageAction} from '../../actions/push-success-message-action'
import {loadMailingListAction} from '../../actions/load-mailing-list'
import compact from 'lodash/compact'
import join from 'lodash/join'
import map from 'lodash/map'
import without from 'lodash/without'
import uniq from 'lodash/uniq'
import range from 'lodash/range'

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

const daysOfWeek = moment => {
  const m = moment()

  return map(range(7), day =>
    <option key={day} value={day}>
      {m.weekday(day).format('dddd')}
    </option>)
}

const PeriodicitySelector = (props, {messages, moment}) => (
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
          {daysOfWeek(moment)}
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
  periodicity: PropTypes.oneOf(['daily', 'weekly', 'monthly']).isRequired,
  onChangePeriodicity: PropTypes.func.isRequired,
  onChangeDayOfWeek: PropTypes.func.isRequired,
  onChangeDayOfMonth: PropTypes.func.isRequired
}
PeriodicitySelector.contextTypes = {
  moment: PropTypes.func.isRequired,
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

    return {
      newEmail: '',
      mailing
    }
  },
  getMailingUrl (mailingId = null) {
    const {params} = this.props

    const path = compact([
      `company/${params.company}`,
      params.workspace && `workspace/${params.workspace}`,
      params.folder && `folder/${params.folder}`,
      params.report && `report/${params.report}`,
      mailingId ? `mailing/${mailingId}` : 'mailing'
    ])

    return '/' + join(path, '/')
  },
  getReportUrl () {
    const {params, mailing: {workspace, folder, report}} = this.props

    const path = compact([
      `company/${params.company}`,
      workspace && `workspace/${workspace.id}`,
      folder && `folder/${folder.id}`,
      `report/${report.id}`
    ])

    return '/' + join(path, '/')
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
  changeMailing (changes) {
    const mailing = assign({}, this.state.mailing, changes)

    this.setState({mailing})
  },
  changeSchedule (sChanges) {
    const schedule = assign({}, this.state.mailing.schedule, sChanges)

    this.changeMailing({schedule})
  },
  onChangeRange ({target: {value: date_range}}) {
    this.changeMailing({date_range})
  },
  onChangeDisabled ({target: {checked}}) {
    this.changeMailing({disabled: !checked})
  },
  onChangeRecurrent ({target: {checked}}) {
    this.changeSchedule(checked
      ? {
        day_of_week: 1,
        day_of_month: null,
        date: null,
        periodicity: 'weekly'
      }
      : {
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
  dropEmail (email) {
    return e => {
      e.preventDefault()
      this.changeMailing({
        emails: without(this.state.mailing.emails, email)
      })
    }
  },
  addEmail () {
    const {mailing: {emails}, newEmail} = this.state

    this.setState({newEmail: ''})
    this.changeMailing({
      emails: uniq(emails.concat([newEmail]))
    })
  },
  onChangeEmail ({target: {value}}) {
    this.setState({newEmail: value})
  },
  handleSubmit (e) {
    e.preventDefault()

    const {state: {newEmail}, props: {params}, context: {router, tree}} = this
    let mailing

    if (newEmail) {
      mailing = assign({}, this.state.mailing)
      mailing.emails.push(newEmail)
    } else {
      mailing = this.state.mailing
    }

    const save = mailing.id ? updateMailingReportAction : createMailingReportAction

    save(tree, params, mailing)
      .then(response => loadMailingListAction(tree, params).then(() => response))
      .then(() => router.push(this.getMailingUrl()))
      .then(() => pushSuccessMessageAction(tree))
  },
  addOnEnter (e) {
    if (e.which === 13) {
      e.preventDefault()
      this.addEmail()
    }
  },
  render () {
    const {mailing, newEmail} = this.state
    const {params} = this.props

    if (!mailing) {
      return <NotFound/>
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <Header>
          <Message report={mailing.report.name}>
            reportMailingFormTitle
          </Message>
        </Header>
        <Content>
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
                checked={!mailing.schedule.date}
                onChange={this.onChangeRecurrent}
                label={<Message>mailingRecurrentSwitch</Message>}/>
            </Middle>
          </div>

          {mailing.schedule.date
            ? (
              <div className='mdl-grid'>
                <div className='mdl-cell mdl-cell--12-col'>
                  <DatePicker
                    value={mailing.schedule.date}
                    onChange={this.onChangeDate}/>
                </div>
              </div>
            )
            : (
              <PeriodicitySelector
                {...mailing.schedule}
                onChangeDayOfMonth={this.onChangeInterval}
                onChangeDayOfWeek={this.onChangeInterval}
                onChangePeriodicity={this.onChangePeriodicity}/>
            )}

          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--10-col'>
              <Input
                type='email'
                name='email'
                label='newEmail'
                value={newEmail}
                onKeyPress={this.addOnEnter}
                onChange={this.onChangeEmail}/>
            </div>
            <Middle className='mdl-cell mdl-cell--2-col'>
              <Button onClick={this.addEmail} className='mdl-button mdl-color-text--light-green-900'>
                <i className='material-icons'>add</i>
              </Button>
            </Middle>
          </div>

          <div className='mdl-list'>
            {map(mailing.emails, email => (
              <div key={email} className='mdl-list__item'>
                <span className='mdl-list__item-primary-content'>
                  {email}
                </span>
                <a className='mdl-list__item-secondary-action' onClick={this.dropEmail(email)}>
                  <i className='material-icons'>clear</i>
                </a>
              </div>))}
          </div>
        </Content>
        <Footer multipleButtons>
          <Link to={this.getMailingUrl()} className='mdl-button mdl-button--accent'>
            <Message>cancel</Message>
          </Link>

          <Submit className='mdl-button mdl-button--primary'>
            <Message>save</Message>
          </Submit>

          {!params.report && (
            <Link to={this.getReportUrl()} className='mdl-button' style={{float: 'right'}}>
              <Message>mailingReportLink</Message>
            </Link>)}
        </Footer>
      </Form>
    )
  }
})

export default MailingEdit
