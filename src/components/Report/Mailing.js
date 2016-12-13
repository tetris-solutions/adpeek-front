import React from 'react'
import Modal from 'tetris-iso/Modal'
import Message from 'tetris-iso/Message'
import {Link} from 'react-router'
import {contextualize} from '../higher-order/contextualize'
import {inferLevelFromParams} from '../../functions/infer-level-from-params'
import Edit from './MailingEdit'
import find from 'lodash/find'
import map from 'lodash/map'
import endsWith from 'lodash/endsWith'
import pick from 'lodash/pick'
import compact from 'lodash/compact'
import join from 'lodash/join'
import {ThumbLink, Title, Container, Cap} from '../ThumbLink'

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

const List = ({mailings, params}, {messages, moment, location: {pathname, search}}) => {
  if (endsWith(pathname, '/new')) {
    return <NewMailing params={params}/>
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
    return <Edit params={params} mailing={find(mailings, {id: params.mailing})}/>
  }

  return (
    <div>
      <Link to={`${url}/new${search}`}>
        <Message>newMailing</Message>
      </Link>
      <hr/>
      <Container>
        {map(mailings, ({id, schedule, report, emails}) => (
          <ThumbLink key={id} to={`${pathname}/${id}${search}`}>
            <Cap>{report.name}</Cap>
            <Title>
              {formattedSchedule(schedule)}
              <br/>
              <small>
                {emails.join(', ')}
              </small>
            </Title>

          </ThumbLink>))}
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
  messages: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  moment: PropTypes.func.isRequired
}

const StandaloneMailingList = props => <List params={props.params} mailings={props[props.level].mailings}/>

StandaloneMailingList.displayName = 'Mailing-List'
StandaloneMailingList.propTypes = {
  params: PropTypes.object,
  level: PropTypes.string.isRequired
}

const ReportMailingList = ({params, report: {mailings}}) => (
  <div style={{display: 'none'}}>
    <Modal>
      <List params={params} mailings={mailings}/>
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
