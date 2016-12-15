import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import {DropdownMenu, MenuItem} from '../DrodownMenu'
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

const {PropTypes} = React

function ReportScreen ({
  report,
  guestMode,
  isGuestUser,
  children,
  downloadReport,
  isCreatingReport
}, {params: {company, workspace, folder}, location: {query: {from, to}}}) {
  const scope = compact([
    `company/${company}`,
    workspace && `workspace/${workspace}`,
    folder && `folder/${folder}`
  ])

  const reportUrl = '/' + join(scope, '/') + `/report/${report.id}`
  const dtRangeQueryString = '?' + qs.stringify({from, to})

  const cloneReportUrl = '/' + join(scope, '/') + `/reports/new?clone=${report.id}&name=${report.name}`

  return (
    <Fence canEditReport>{({canEditReport}) =>
      <div>
        <SubHeader>
          <DateRangeButton
            disabled={guestMode}
            className='mdl-button mdl-color-text--grey-100'/>

          <Button className='mdl-button mdl-js-button mdl-button--icon'>
            <i className='material-icons'>open_in_new</i>

            <DropdownMenu provide={['report']}>
              {canEditReport && (
                <AccessControl/>)}

              {guestMode && !isGuestUser && (
                <MenuItem tag='a' href={cloneReportUrl} icon='content_copy'>
                  <Message>save</Message>
                </MenuItem>)}

              {!guestMode && <ShareButton shareUrl={report.shareUrl}/>}

              <ReportExportButton
                create={downloadReport}
                isCreatingReport={isCreatingReport}/>

              {!guestMode && <MenuItem tag={Link} to={`${reportUrl}/mailing`} icon='mail_outline'>
                <Message>reportMailing</Message>
              </MenuItem>}

              {guestMode && !isGuestUser && (
                <MenuItem tag='a' href={reportUrl + dtRangeQueryString} icon='settings'>
                  <Message>viewFullReport</Message>
                </MenuItem>)}
            </DropdownMenu>
          </Button>
        </SubHeader>

        {!guestMode
          ? <Page>{children}</Page>
          : children}
      </div>}
    </Fence>
  )
}
ReportScreen.displayName = 'Report-Screen'
ReportScreen.propTypes = {
  guestMode: PropTypes.bool.isRequired,
  isGuestUser: PropTypes.bool.isRequired,
  report: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  downloadReport: PropTypes.func.isRequired,
  isCreatingReport: PropTypes.bool.isRequired
}
ReportScreen.contextTypes = {
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}
export default ReportScreen
