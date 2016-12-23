import Message from 'tetris-iso/Message'
import React from 'react'
import {ThumbLink, Title, Gear} from './ThumbLink'
import {DropdownMenu, MenuItem} from './DropdownMenu'
import {Link} from 'react-router'
import {deleteFolderAction} from '../actions/delete-folder'
import {DeleteSpan} from './DeleteButton'
import ReportLink from './Report/ReportLink'

const {PropTypes} = React

const DeleteFolder = ({params, dispatch, id, name}) => (
  <MenuItem
    icon='delete'
    tag={DeleteSpan}
    onClick={() => dispatch(deleteFolderAction, params, id)}
    entityName={name}>
    <Message>deleteFolder</Message>
  </MenuItem>
)
DeleteFolder.displayName = 'Delete-Folder'
DeleteFolder.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

const FolderCard = ({id, name, reports, editable, dispatch, params}) => {
  const {company, workspace} = params
  const folderUrl = `/company/${company}/workspace/${workspace}/folder/${id}`

  return (
    <ThumbLink to={folderUrl} title={name}>
      <Title>{name}</Title>
      <Gear>
        <DropdownMenu>
          <MenuItem to={`${folderUrl}/creatives`} tag={Link} icon='receipt'>
            <Message>creatives</Message>
          </MenuItem>

          <MenuItem to={`${folderUrl}/orders`} tag={Link} icon='attach_money'>
            <Message>folderOrders</Message>
          </MenuItem>

          <ReportLink
            tag={MenuItem}
            params={{company, workspace, folder: id}}
            reports={reports}
            dispatch={dispatch}>
            <Message>folderReport</Message>
          </ReportLink>

          {editable &&
          <MenuItem to={`${folderUrl}/edit`} tag={Link} icon='mode_edit'>
            <Message>editFolder</Message>
          </MenuItem>}

          {editable &&
          <DeleteFolder
            id={id}
            name={name}
            params={params}
            dispatch={dispatch}/>}

        </DropdownMenu>
      </Gear>
    </ThumbLink>
  )
}

FolderCard.displayName = 'FolderCard'
FolderCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  reports: PropTypes.array,
  editable: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired
}

export default FolderCard
