import Message from 'tetris-iso/Message'
import React from 'react'
import {ThumbLink, Cap, Gear} from './ThumbLink'
import {DropdownMenu, MenuItem} from './DropdownMenu'
import {Link} from 'react-router'
import {deleteFolderAction} from '../actions/delete-folder'
import {DeleteSpan} from './DeleteButton'
import ReportLink from './Report/ReportLink'
import FolderStats from './FolderStats'
import {node} from './higher-order/branch'

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
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  params: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired
}

const FolderCard = ({id, account: {platform}, kpi_goal, name, stats, reports, editable, dispatch, params}) => {
  const {company, workspace} = params
  const folderUrl = `/company/${company}/workspace/${workspace}/folder/${id}`

  return (
    <ThumbLink to={folderUrl} title={name} style={{width: 280}}>
      <Cap bg={platform === 'adwords' ? 'amber-800' : 'blue-900'}>
        {name}
      </Cap>

      <FolderStats params={params} stats={stats} id={id} kpi_goal={kpi_goal}/>

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
  id: React.PropTypes.string.isRequired,
  kpi_goal: React.PropTypes.number,
  account: React.PropTypes.shape({
    platform: React.PropTypes.string
  }).isRequired,
  name: React.PropTypes.string.isRequired,
  stats: React.PropTypes.object,
  reports: React.PropTypes.array,
  editable: React.PropTypes.bool.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  params: React.PropTypes.object.isRequired
}

const Wrapper = props => (
  <FolderCard {...props} {...props.folder}/>
)
Wrapper.displayName = 'Wrapper'
Wrapper.propTypes = {
  folder: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object
}

export default node('folders', 'folder', Wrapper)
