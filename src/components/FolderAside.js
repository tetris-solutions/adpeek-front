import isEmpty from 'lodash/isEmpty'
import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import endsWith from 'lodash/endsWith'
import Fence from './Fence'
import {Navigation, Button, Buttons, Name} from './Navigation'
import DeleteButton from './DeleteButton'
import {deleteFolderAction} from '../actions/delete-folder'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function FolderAside ({
  dispatch,
  folder,
  params: {company, workspace}
}, {router, location}) {
  function onClick () {
    dispatch(deleteFolderAction, folder.id)
      .then(() => router.replace(`/company/${company}/workspace/${workspace}`))
  }

  const baseUrl = `/company/${company}/workspace/${workspace}/folder/${folder.id}`
  const linkToReportList = isEmpty(folder.reports)

  const reportUrl = `${baseUrl}/${linkToReportList ? 'reports' : 'report/' + folder.reports[0].id}`
  const backspaceUrl = endsWith(location.pathname, folder.id)
    ? `/company/${company}/workspace/${workspace}`
    : baseUrl

  return (
    <Fence canEditFolder canBrowseReports>
      {({canEditFolder, canBrowseReports}) =>
        <Navigation icon='folder'>
          <Name>
            {folder.name}
          </Name>
          <Buttons>
            <Button tag={Link} to={`${baseUrl}/creatives`} icon='receipt'>
              <Message>creatives</Message>
            </Button>

            <Button tag={Link} to={`${baseUrl}/orders`} icon='attach_money'>
              <Message>folderOrders</Message>
            </Button>

            {(canBrowseReports || !linkToReportList) && (
              <Button tag={Link} to={reportUrl} icon='show_chart'>
                <Message>folderReport</Message>
              </Button>)}

            {canEditFolder && (
              <Button tag={Link} to={`${baseUrl}/edit`} icon='mode_edit'>
                <Message>editFolder</Message>
              </Button>)}

            {canEditFolder && (
              <Button tag={DeleteButton} entityName={folder.name} onClick={onClick} icon='delete'>
                <Message>deleteFolder</Message>
              </Button>)}

            <Button tag={Link} to={backspaceUrl} icon='close'>
              <Message>oneLevelUpNavigation</Message>
            </Button>
          </Buttons>
        </Navigation>}
    </Fence>
  )
}

FolderAside.displayName = 'Folder-Aside'
FolderAside.contextTypes = {
  router: PropTypes.object,
  location: PropTypes.object
}
FolderAside.propTypes = {
  dispatch: PropTypes.func,
  folder: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string
  })
}

export default contextualize(FolderAside, 'folder')
