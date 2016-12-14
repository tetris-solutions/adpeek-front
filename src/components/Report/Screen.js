import Message from 'tetris-iso/Message'
import React from 'react'
import {DropdownMenu, MenuItem} from '../DrodownMenu'
import SubHeader from '../SubHeader'
import ReportExportButton from './ExportButton'
import DateRangeButton from './DateRangeButton'
import Page from '../Page'
import ShareButton from './ShareButton'
import {Button} from '../Button'
import join from 'lodash/join'
import compact from 'lodash/compact'
import qs from 'query-string'

const {PropTypes} = React

function ReportScreen ({
  report,
  children,
  showShareButton,
  showContextMenu,
  shareUrl,
  showNewModuleButton,
  canChangeDateRange,
  showFullReportLink,
  downloadReport,
  isCreatingReport,
  addNewModule
}, {params: {company, workspace, folder}, location: {query: {from, to}}}) {
  const scope = compact([
    `company/${company}`,
    workspace && `workspace/${workspace}`,
    folder && `folder/${folder}`
  ])

  const fullReportUrl = '/' + join(scope, '/') + `/report/${report.id}?` + qs.stringify({from, to})
  const cloneReportUrl = '/' + join(scope, '/') + `/reports/new?clone=${report.id}&name=${report.name}`

  return (
    <div>
      <SubHeader>
        <DateRangeButton
          disabled={!canChangeDateRange}
          className='mdl-button mdl-color-text--grey-100'/>

        <Button className='mdl-button mdl-js-button mdl-button--icon'>
          <i className='material-icons'>more_vert</i>

          <DropdownMenu provide={['report']}>
            {showNewModuleButton && <MenuItem onClick={addNewModule}>
              <Message>newModule</Message>
            </MenuItem>}

            {showFullReportLink && (
              <MenuItem tag='a' href={fullReportUrl}>
                <Message>viewFullReport</Message>
              </MenuItem>)}

            {showFullReportLink && (
              <MenuItem tag='a' href={cloneReportUrl}>
                <Message>cloneReport</Message>
              </MenuItem>)}

            {showShareButton && <ShareButton shareUrl={shareUrl}/>}

            <ReportExportButton
              create={downloadReport}
              isCreatingReport={isCreatingReport}/>
          </DropdownMenu>
        </Button>

      </SubHeader>

      {showContextMenu
        ? <Page>{children}</Page>
        : children}
    </div>
  )
}
ReportScreen.displayName = 'Report-Screen'
ReportScreen.propTypes = {
  report: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  showNewModuleButton: PropTypes.bool.isRequired,
  canChangeDateRange: PropTypes.bool.isRequired,
  downloadReport: PropTypes.func.isRequired,
  isCreatingReport: PropTypes.bool.isRequired,
  addNewModule: PropTypes.func.isRequired,
  showShareButton: PropTypes.bool.isRequired,
  showContextMenu: PropTypes.bool.isRequired,
  showFullReportLink: PropTypes.bool,
  shareUrl: PropTypes.string
}
ReportScreen.contextTypes = {
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}
export default ReportScreen
