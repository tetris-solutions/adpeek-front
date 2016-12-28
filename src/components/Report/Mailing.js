import React from 'react'
import Message from 'tetris-iso/Message'
import Page from '../Page'
import isEmpty from 'lodash/isEmpty'
import SubHeader from '../SubHeader'
import {Link} from 'react-router'
import {updateMailingReportAction} from '../../actions/update-mailing-action'
import {deleteMailingAction} from '../../actions/delete-mailing'
import {spawnReportMailingAction} from '../../actions/spawn-report-mailing'
import {pushSuccessMessageAction} from '../../actions/push-success-message-action'
import {contextualize} from '../higher-order/contextualize'
import {inferLevelFromParams} from '../../functions/infer-level-from-params'
import Edit from './MailingEdit'
import find from 'lodash/find'
import map from 'lodash/map'
import endsWith from 'lodash/endsWith'
import pick from 'lodash/pick'
import compact from 'lodash/compact'
import join from 'lodash/join'
import {ThumbLink, Title, Container, Cap, Info, Gear} from '../ThumbLink'
import {DropdownMenu, MenuItem, HeaderMenuItem} from '../DropdownMenu'
import assign from 'lodash/assign'
import {DeleteSpan} from '../DeleteButton'
import TextMessage from 'intl-messageformat'
import Switch from '../Switch'
import filter from 'lodash/filter'

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
  params: React.PropTypes.object,
  report: React.PropTypes.object,
  company: React.PropTypes.object,
  workspace: React.PropTypes.object,
  folder: React.PropTypes.object
}

const NewMailing = contextualize(New, 'report', 'company', 'workspace', 'folder')

const MailingLink = React.createClass({
  displayName: 'Mailing-Link',
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    mailing: React.PropTypes.object.isRequired,
    url: React.PropTypes.string.isRequired
  },
  contextTypes: {
    locales: React.PropTypes.string.isRequired,
    messages: React.PropTypes.object.isRequired,
    moment: React.PropTypes.func.isRequired
  },
  toggle () {
    const {dispatch, params, mailing} = this.props

    dispatch(updateMailingReportAction, params, assign({}, mailing, {
      disabled: !mailing.disabled
    }))
  },
  del () {
    const {dispatch, params, mailing} = this.props

    dispatch(deleteMailingAction, params, mailing.id)
  },
  run () {
    const {dispatch, mailing} = this.props

    dispatch(spawnReportMailingAction, mailing.id)
      .then(() => dispatch(pushSuccessMessageAction))
  },
  render () {
    const {mailing, url} = this.props
    const {messages, moment, locales} = this.context
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
        <Cap bg={mailing.disabled ? 'grey-600' : undefined}>
          {report.name}
        </Cap>

        <Info>
          {workspace ? <i className='material-icons'>domain</i> : null}
          {workspace ? workspace.name : null}
          {workspace && folder ? <br/> : null}

          {folder ? <i className='material-icons'>folder</i> : null}
          {folder ? folder.name : null}
        </Info>

        <Title>
          {formattedSchedule(schedule)}
          <br/>
          <small>
            {dateRangeMessages[date_range]}
          </small>
        </Title>
        <Gear>
          <DropdownMenu>
            <HeaderMenuItem
              icon={mailing.disabled ? 'check_box_outline_blank' : 'check_box'}
              onClick={this.toggle}>
              <Message>
                {mailing.disabled ? 'enableMailing' : 'disableMailing'}
              </Message>
            </HeaderMenuItem>

            <MenuItem
              tag={DeleteSpan}
              entityName={new TextMessage(messages.reportMailingFormTitle, locales).format({report: report.name})}
              onClick={this.del} icon='delete'>
              <Message>remove</Message>
            </MenuItem>

            <MenuItem onClick={this.run} icon='mail'>
              <Message>spawnMailing</Message>
            </MenuItem>
          </DropdownMenu>
        </Gear>
      </ThumbLink>
    )
  }
})

const List = React.createClass({
  displayName: 'Mailings',
  propTypes: {
    url: React.PropTypes.string.isRequired,
    mailings: React.PropTypes.array.isRequired,
    params: React.PropTypes.object.isRequired
  },
  contextTypes: {
    location: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  },
  getInitialState () {
    return {
      activeOnly: true
    }
  },
  onSwitch ({target: {checked: activeOnly}}) {
    this.setState({activeOnly})
  },
  render () {
    const {activeOnly} = this.state
    const {location: {pathname, query}} = this.context
    const {url, params} = this.props
    const mailings = activeOnly
      ? filter(this.props.mailings, ({disabled, id}) => !disabled || id === params.mailing)
      : this.props.mailings

    const shouldDisplayCreationForm = endsWith(pathname, '/new') || (
        query.skipEmptyList && isEmpty(mailings)
      )

    if (shouldDisplayCreationForm) {
      return <NewMailing {...this.props}/>
    }

    const editMode = Boolean(params.mailing)

    if (editMode) {
      return <Edit {...this.props} mailing={find(mailings, {id: params.mailing})}/>
    }

    return (
      <Container>
        <span style={{float: 'right'}}>
          <Switch
            checked={this.state.activeOnly}
            name='activeOrdersOnly'
            label={<Message>filterActiveOnly</Message>}
            onChange={this.onSwitch}/>
        </span>

        {map(mailings, mailing =>
          <MailingLink
            {...this.props}
            key={mailing.id}
            mailing={mailing}
            url={`${url}/${mailing.id}`}/>)}
      </Container>
    )
  }
})

const Content = props => {
  const {params} = props

  const url = '/' + join(
      compact([
        `company/${params.company}`,
        params.workspace && `workspace/${params.workspace}`,
        params.folder && `folder/${params.folder}`,
        params.report && `report/${params.report}`,
        'mailing'
      ]), '/')

  return (
    <div>
      <SubHeader title={<Message>reportMailing</Message>}>
        {params.report && (
          <Link className='mdl-button mdl-color-text--grey-100' to={`${url}/new`}>
            <i className='material-icons'>add</i>
            <Message>newMailing</Message>
          </Link>)}
      </SubHeader>
      <Page>
        <List {...props} url={url}/>
      </Page>
    </div>
  )
}

Content.displayName = 'Content'
Content.propTypes = {
  params: React.PropTypes.object.isRequired
}

const StandaloneMailingList = props => (
  <Content {...props} mailings={props[props.level].mailings}/>
)

StandaloneMailingList.displayName = 'Mailing-List'
StandaloneMailingList.propTypes = {
  params: React.PropTypes.object,
  level: React.PropTypes.string.isRequired
}

const ReportMailingList = props => (
  <Content {...props} mailings={props.report.mailings}/>
)

ReportMailingList.displayName = 'Report-Mailing-List'
ReportMailingList.propTypes = {
  params: React.PropTypes.object,
  report: React.PropTypes.shape({
    mailings: React.PropTypes.array
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
  params: React.PropTypes.object
}

export default Mailing
