import Message from 'tetris-iso/Message'
import React from 'react'
import SubHeader from '../SubHeader'
import ReportExportButton from './ExportButton'
import DateRangeButton from './DateRangeButton'
import Page from '../Page'
import ShareButton from './ShareButton'
import {Button} from '../Button'

const {PropTypes} = React

const ReportScreen = ({
  children,
  showShareButton,
  showContextMenu,
  shareUrl,
  showNewModuleButton,
  canChangeDateRange,
  fullReportUrl,
  downloadReport,
  isCreatingReport,
  addNewModule
}) => (
  <div>
    <SubHeader>

      <DateRangeButton disabled={!canChangeDateRange} className='mdl-button mdl-color-text--grey-100'/>

      {fullReportUrl && (
        <a href={fullReportUrl} className='mdl-button mdl-color-text--grey-100'>
          <Message>viewFullReport</Message>
        </a>)}

      {showNewModuleButton && (
        <Button className='mdl-button mdl-color-text--grey-100' onClick={addNewModule}>
          <Message>newModule</Message>
        </Button>)}

      {showShareButton && (
        <ShareButton className='mdl-button mdl-color-text--grey-100' shareUrl={shareUrl}/>)}

      <ReportExportButton
        create={downloadReport}
        isCreatingReport={isCreatingReport}/>
    </SubHeader>

    {showContextMenu
      ? <Page>{children}</Page>
      : children}
  </div>
)
ReportScreen.displayName = 'Report-Screen'
ReportScreen.propTypes = {
  children: PropTypes.node.isRequired,
  showNewModuleButton: PropTypes.bool.isRequired,
  canChangeDateRange: PropTypes.bool.isRequired,
  downloadReport: PropTypes.func.isRequired,
  isCreatingReport: PropTypes.bool.isRequired,
  addNewModule: PropTypes.func.isRequired,
  showShareButton: PropTypes.bool.isRequired,
  showContextMenu: PropTypes.bool.isRequired,
  fullReportUrl: PropTypes.string,
  shareUrl: PropTypes.string
}
export default ReportScreen
