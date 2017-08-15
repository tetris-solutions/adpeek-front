import Message from 'tetris-iso/Message'
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {DropdownMenu, MenuItem, HeaderMenuItem} from '../DropdownMenu'
import SubHeader from '../SubHeader'
import ReportExportButton from './ExportButton'
import DateRangeButton from './DateRangeButton'
import AccessControl from './AccessControl'
import Page from '../Page'
import ShareButton from './ShareButton'
import {Button} from '../Button'
import join from 'lodash/join'
import compact from 'lodash/compact'
import qs from 'query-string'
import Fence from '../Fence'
import {branch} from '../higher-order/branch'

function borrowed (user, {authorized, is_private, author}) {
  return !authorized || (
    is_private &&
    author &&
    author.id !== user.id
  )
}

function ReportScreen (props, context) {
  const {user, favoriteReport, report, reportLiteMode, children, downloadReport, isCreatingReport} = props
  const {messages, params: {company, workspace, folder}, location: {query: {from, to}}} = context
  const scope = compact([
    `company/${company}`,
    workspace && `workspace/${workspace}`,
    folder && `folder/${folder}`
  ])

  const reportUrl = '/' + join(scope, '/') + `/report/${report.id}`
  const dtRangeQueryString = '?' + qs.stringify({from, to})

  const cloneReportUrl = '/' + join(scope, '/') + `/reports/new?clone=${report.id}&name=${report.name}`

  return (
    <Fence isRegularUser canBrowseReports canEditReport>{({canEditReport, canBrowseReports, isRegularUser}) =>
      <div>
        <SubHeader>
          <DateRangeButton
            disabled={reportLiteMode}
            className='mdl-button mdl-color-text--grey-100'/>

          <Button className='mdl-button mdl-js-button mdl-button--icon'>
            <i className='material-icons'>open_in_new</i>

            <DropdownMenu provide={['report']}>
              {canBrowseReports && (
                <HeaderMenuItem
                  onClick={favoriteReport}
                  title={report.is_user_selected ? messages.unfavoriteReportDescription : messages.favoriteReportDescription}
                  icon={report.is_user_selected ? 'star' : 'star_border'}>

                  {report.is_user_selected
                    ? <Message>unfavoriteReport</Message>
                    : <Message>favoriteReport</Message>}
                </HeaderMenuItem>)}

              {canEditReport && (
                <AccessControl/>)}

              {reportLiteMode && isRegularUser && (
                <MenuItem tag='a' href={cloneReportUrl} icon='content_copy'>
                  <Message>save</Message>
                </MenuItem>)}

              {!reportLiteMode && <ShareButton {...report}/>}

              <ReportExportButton
                create={downloadReport}
                isCreatingReport={isCreatingReport}/>

              {!reportLiteMode &&
              <MenuItem tag={Link} to={`${reportUrl}/mailing?skipEmptyList=true`} icon='mail_outline'>
                <Message>reportMailing</Message>
              </MenuItem>}

              {reportLiteMode && isRegularUser && !borrowed(user, report) && (
                <MenuItem tag='a' href={reportUrl + dtRangeQueryString} icon='settings'>
                  <Message>viewFullReport</Message>
                </MenuItem>)}
            </DropdownMenu>
          </Button>
        </SubHeader>

        <Page>{children}</Page>
      </div>}
    </Fence>
  )
}

ReportScreen.displayName = 'Report-Screen'
ReportScreen.propTypes = {
  user: PropTypes.object.isRequired,
  reportLiteMode: PropTypes.bool,
  downloadReport: PropTypes.func.isRequired,
  favoriteReport: PropTypes.func.isRequired,
  report: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  isCreatingReport: PropTypes.bool.isRequired
}
ReportScreen.contextTypes = {
  messages: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default branch('user', ReportScreen)
