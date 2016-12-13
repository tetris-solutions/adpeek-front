import React from 'react'
import Modal from 'tetris-iso/Modal'
import Message from 'tetris-iso/Message'
import {Link} from 'react-router'
import {updateMailingReportAction} from '../../actions/update-mailing-action'
import {contextualize} from '../higher-order/contextualize'
import {inferLevelFromParams} from '../../functions/infer-level-from-params'
import Edit from './MailingEdit'
import find from 'lodash/find'
import map from 'lodash/map'
import endsWith from 'lodash/endsWith'
import pick from 'lodash/pick'
import compact from 'lodash/compact'
import join from 'lodash/join'
import {ThumbLink, Title, Container, Cap, Info} from '../ThumbLink'
import assign from 'lodash/assign'

const {PropTypes} = React

const extract = o => o ? pick(o, 'id', 'name') : null

const New = ({params, report, company, workspace, folder}) => (
  <Edit
    params={params}
    mailing={{
      id: null,
      date_range: 'last 30 days',
      disabled: false,
      schedule: {
        day_of_week: 1
      },
      emails: [],
      report: extract(report),
      company: extract(company),
      workspace: extract(workspace),
      folder: extract(folder)
    }}/>
)

New.displayName = 'New-Mailing'
New.propTypes = {
  params: PropTypes.object,
  report: PropTypes.object,
  company: PropTypes.object,
  workspace: PropTypes.object,
  folder: PropTypes.object
}

const NewMailing = contextualize(New, 'report', 'company', 'workspace', 'folder')

const MailingLink = React.createClass({
  displayName: 'Mailing-Link',
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    mailing: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired
  },
  contextTypes: {
    messages: PropTypes.object.isRequired,
    moment: PropTypes.func.isRequired
  },
  toggle (e) {
    e.preventDefault()
    const {dispatch, params, mailing} = this.props

    dispatch(updateMailingReportAction, params, assign({}, mailing, {
      disabled: !mailing.disabled
    }))
  },
  render () {
    const {mailing, url} = this.props
    const {messages, moment} = this.context
    const {schedule, date_range, report, folder, workspace} = mailing

    const dateRangeMessages = {
      today: messages.today,
      yesterday: messages.yesterday,
      'last week': messages.pastWeek,
      'last month': messages.pastMonth,
      'last 30 days': messages.last30Days,
      'this month': messages.currentMonth
    }

    function formattedSchedule ({day_of_month, day_of_week, date}) {
      if (date) {
        return moment(date).format('DD/MM/YYYY')
      }

      if (day_of_week) {
        return moment().weekday(day_of_week).format('dddd')
      }

      if (day_of_month) {
        return moment().month('Jan').date(day_of_month).format('Do')
      }

      return messages.daily
    }

    return (
      <ThumbLink to={url}>
        <Cap>
          {report.name}
        </Cap>

        <div className='mdl-color-text--green-800' style={{margin: '.5em 1em 0 0', textAlign: 'right'}}>
          <i className='material-icons' onClick={this.toggle}>{
            mailing.disabled ? 'panorama_fish_eye' : 'lens'}</i>
        </div>

        <Info>
          {folder ? <i className='material-icons'>folder</i> : null}
          {folder ? folder.name : null}
          {folder ? <br/> : null}

          {workspace ? <i className='material-icons'>domain</i> : null}
          {workspace ? workspace.name : null}
        </Info>

        <Title>
          {formattedSchedule(schedule)}
          <br/>
          <small>
            {dateRangeMessages[date_range]}
          </small>
        </Title>

      </ThumbLink>
    )
  }
})

const List = (props, {location: {pathname, search}}) => {
  const {mailings, params} = props

  if (endsWith(pathname, '/new')) {
    return <NewMailing {...props}/>
  }

  const url = '/' + join(
      compact([
        `company/${params.company}`,
        params.workspace && `workspace/${params.workspace}`,
        params.folder && `folder/${params.folder}`,
        params.report && `report/${params.report}`,
        'mailing'
      ]), '/')

  // const singleReportMode = Boolean(params.report)
  const editMode = Boolean(params.mailing)

  if (editMode) {
    return <Edit {...props} mailing={find(mailings, {id: params.mailing})}/>
  }

  return (
    <div>
      <Link to={`${url}/new${search}`}>
        <Message>newMailing</Message>
      </Link>
      <hr/>
      <Container>
        {map(mailings, mailing =>
          <MailingLink
            {...props}
            key={mailing.id}
            mailing={mailing}
            url={`${url}/${mailing.id}${search}`}/>)}
      </Container>
    </div>
  )
}

List.displayName = 'List'
List.propTypes = {
  mailings: PropTypes.array,
  params: PropTypes.shape({
    report: PropTypes.string,
    mailing: PropTypes.string
  })
}
List.contextTypes = {
  location: PropTypes.object.isRequired
}

const StandaloneMailingList = props => (
  <List {...props} mailings={props[props.level].mailings}/>
)

StandaloneMailingList.displayName = 'Mailing-List'
StandaloneMailingList.propTypes = {
  params: PropTypes.object,
  level: PropTypes.string.isRequired
}

const ReportMailingList = props => (
  <div style={{display: 'none'}}>
    <Modal>
      <List {...props} mailings={props.report.mailings}/>
    </Modal>
  </div>
)

ReportMailingList.displayName = 'Report-Mailing-List'
ReportMailingList.propTypes = {
  params: PropTypes.object,
  report: PropTypes.shape({
    mailings: PropTypes.array
  })
}

const wired = {
  company: contextualize(StandaloneMailingList, 'company'),
  workspace: contextualize(StandaloneMailingList, 'workspace'),
  folder: contextualize(StandaloneMailingList, 'folder'),
  report: contextualize(ReportMailingList, 'report')
}

const Mailing = props => {
  const level = props.params.report
    ? 'report'
    : inferLevelFromParams(props.params)

  const Component = wired[level]

  return <Component {...props} level={level}/>
}

Mailing.displayName = 'Mailing'
Mailing.propTypes = {
  params: PropTypes.object
}

export default Mailing
