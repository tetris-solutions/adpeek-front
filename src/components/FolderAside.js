import Message from 'tetris-iso/Message'
import React from 'react'
import endsWith from 'lodash/endsWith'
import Fence from './Fence'
import {Navigation, NavBt, NavLink, NavBts, Name} from './Navigation'
import DeleteButton from './DeleteButton'
import {deleteFolderAction} from '../actions/delete-folder'
import {contextualize} from './higher-order/contextualize'
import ReportLink from './Report/ReportLink'

export function FolderAside ({
  dispatch,
  folder,
  params
}, {router, location}) {
  const {company, workspace} = params

  function onClick () {
    dispatch(deleteFolderAction, params, folder.id)
      .then(() => {
        router.replace(`/company/${company}/workspace/${workspace}`)
      })
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
  router: React.PropTypes.object,
  location: React.PropTypes.object
}
FolderAside.propTypes = {
  dispatch: React.PropTypes.func,
  folder: React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string
  }),
  params: React.PropTypes.shape({
    company: React.PropTypes.string,
    workspace: React.PropTypes.string
  })
}

export default contextualize(FolderAside, 'folder')
