import Message from 'tetris-iso/Message'
import React from 'react'
import PropTypes from 'prop-types'
import {ThumbLink, Cap, Gear} from './ThumbLink'
import {DropdownMenu, MenuItem} from './DropdownMenu'
import {Link} from 'react-router'
import {deleteFolderAction} from '../actions/delete-folder'
import {DeleteSpan} from './DeleteButton'
import ReportLink from './Report/ReportLink'
import FolderStats from './FolderStats'
import {node} from './higher-order/branch'
import {showFolderAction} from '../actions/show-folder'
import {hideFolderAction} from '../actions/hide-folder'

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

const platformColor = {
  adwords: 'amber-A700',
  facebook: 'blue-900',
  analytics: 'deep-orange-A400'
}

const FolderCard = ({id, account: {platform}, kpi_goal, name, stats, reports, editable, hidden, reload, dispatch, params}) => {
  const {company, workspace} = params
  const folderUrl = `/company/${company}/workspace/${workspace}/folder/${id}`
  const isAnalytics = platform === 'analytics'

  return (
    <ThumbLink to={folderUrl} title={name} style={{width: 280}}>
      <Cap bg={hidden ? 'grey-600' : platformColor[platform]}>
        {name}
      </Cap>

      <FolderStats params={params} stats={stats} id={id} kpi_goal={kpi_goal}/>

      <Gear>
        <DropdownMenu>
          {!isAnalytics && <MenuItem to={`${folderUrl}/creatives`} tag={Link} icon='receipt'>
            <Message>creatives</Message>
          </MenuItem>}

          {!isAnalytics && <MenuItem to={`${folderUrl}/orders`} tag={Link} icon='attach_money'>
            <Message>folderOrders</Message>
          </MenuItem>}

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

          {hidden
            ? (
              <MenuItem icon='visibility' onClick={() => dispatch(showFolderAction, params).then(reload)}>
                <Message>showFolder</Message>
              </MenuItem>
            ) : (
              <MenuItem icon='visibility_off' onClick={() => dispatch(hideFolderAction, params).then(reload)}>
                <Message>hideFolder</Message>
              </MenuItem>
            )}

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

FolderCard.displayName = 'Card'
FolderCard.propTypes = {
  id: PropTypes.string.isRequired,
  reload: PropTypes.func,
  hidden: PropTypes.bool,
  kpi_goal: PropTypes.number,
  account: PropTypes.shape({
    platform: PropTypes.string
  }).isRequired,
  name: PropTypes.string.isRequired,
  stats: PropTypes.object,
  reports: PropTypes.array,
  editable: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired
}

const Folder = props => (
  <FolderCard {...props} {...props.folder}/>
)
Folder.displayName = 'Folder'
Folder.propTypes = {
  folder: PropTypes.object,
  dispatch: PropTypes.func,
  params: PropTypes.object
}

export default node('folders', 'folder', Folder)
