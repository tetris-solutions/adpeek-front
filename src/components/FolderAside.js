import Message from 'tetris-iso/Message'
import React from 'react'
import endsWith from 'lodash/endsWith'
import Fence from './Fence'
import {Navigation, NavBt, NavLink, NavBts, Name} from './Navigation'
import DeleteButton from './DeleteButton'
import {deleteFolderAction} from '../actions/delete-folder'
import {contextualize} from './higher-order/contextualize'
import ReportLink from './Report/ReportLink'

const {PropTypes} = React

export function FolderAside ({
  dispatch,
  folder,
  params
}, {router, location}) {
  const {company, workspace} = params

  function onClick () {
    router.replace(`/company/${company}/workspace/${workspace}`)
    dispatch(deleteFolderAction, params, folder.id)
  }

  const baseUrl = `/company/${company}/workspace/${workspace}/folder/${folder.id}`
  const backspaceUrl = endsWith(location.pathname, folder.id)
    ? `/company/${company}/workspace/${workspace}`
    : baseUrl

  return (
    <Fence canEditFolder>{({canEditFolder}) =>
      <Navigation icon='folder'>
        <Name>
          {folder.name}
        </Name>
        <NavBts>
          <NavLink to={`${baseUrl}/creatives`} icon='receipt'>
            <Message>creatives</Message>
          </NavLink>

          <NavLink to={`${baseUrl}/orders`} icon='attach_money'>
            <Message>folderOrders</Message>
          </NavLink>

          <ReportLink tag={NavLink} params={params} reports={folder.reports} dispatch={dispatch}>
            <Message>folderReport</Message>
          </ReportLink>

          {canEditFolder && (
            <NavLink to={`${baseUrl}/edit`} icon='mode_edit'>
              <Message>editFolder</Message>
            </NavLink>)}

          {canEditFolder && (
            <NavBt tag={DeleteButton} entityName={folder.name} onClick={onClick} icon='delete'>
              <Message>deleteFolder</Message>
            </NavBt>)}

          <NavLink to={backspaceUrl} icon='close'>
            <Message>oneLevelUpNavigation</Message>
          </NavLink>
        </NavBts>
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
