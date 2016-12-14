import Message from 'tetris-iso/Message'
import React from 'react'
import {DropdownMenu, MenuItem} from '../DrodownMenu'
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
      <DateRangeButton
        disabled={!canChangeDateRange}
        className='mdl-button mdl-color-text--grey-100'/>

      <Button className='mdl-button mdl-js-button mdl-button--icon'>
        <i className='material-icons'>more_vert</i>

        <DropdownMenu provide={['report']}>
          {showNewModuleButton && <MenuItem onClick={addNewModule}>
            <Message>newModule</Message>
          </MenuItem>}

          {fullReportUrl && (
            <MenuItem tag='a' href={fullReportUrl}>
              <Message>viewFullReport</Message>
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
