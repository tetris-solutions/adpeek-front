import React from 'react'
import {Link} from 'react-router'
import {node} from '../higher-order/branch'
import style from './style'
import Message from 'tetris-iso/Message'
import {ThumbLink, BottomLine, Cap, Gear} from '../ThumbLink'
import {deleteWorkspaceAction} from '../../actions/delete-workspace'
import {unfavoriteWorkspaceAction} from '../../actions/unfavorite-workspace'
import {favoriteWorkspaceAction} from '../../actions/favorite-workspace'
import {DropdownMenu, MenuItem, HeaderMenuItem} from '../DropdownMenu'
import ReportLink from '../Report/ReportLink'
import {DeleteSpan} from '../DeleteButton'
import Fence from '../Fence'
import Stats from './Stats'

const Workspace = ({workspace, params, dispatch}) => {
  const run = (action, after = undefined) => () => dispatch(action, params)

  return (
    <ThumbLink to={`/company/${params.company}/workspace/${workspace.id}`} title={workspace.name}>
      <Cap>{workspace.name}</Cap>
      <Stats {...workspace.stats}/>

      <BottomLine>
        <div className={`${style.label}`}>
          <Message>workspaceFoldersSummary</Message>:
        </div>

        <div className={`${style.numbers}`}>
          <img className={`${style.platform}`} src='/img/g-circle-32.png'/>
          <strong className={`${style.number}`}>
            {Number(workspace.summary.adwords || 0)}
          </strong>

          <img className={`${style.platform}`} src='/img/fb-circle-32.png'/>
          <strong className={`${style.number}`}>
            {Number(workspace.summary.facebook || 0)}
          </strong>
        </div>
      </BottomLine>
      <Gear>
        <DropdownMenu>
          {workspace.favorite
            ? (
              <HeaderMenuItem icon='star' onClick={run(unfavoriteWorkspaceAction)}>
                <Message>unfaveWorkspace</Message>
              </HeaderMenuItem>
            ) : (
              <HeaderMenuItem icon='star_border' onClick={run(favoriteWorkspaceAction)}>
                <Message>faveWorkspace</Message>
              </HeaderMenuItem>
            )}

          <ReportLink
            tag={MenuItem}
            params={{company: params.company, workspace: workspace.id}}
            reports={workspace.reports}
            dispatch={dispatch}>
            <Message>workspaceReport</Message>
          </ReportLink>

          <Fence canEditWorkspace>
            <MenuItem tag={Link} to={`/company/${params.company}/workspace/${workspace.id}/edit`} icon='mode_edit'>
              <Message>editWorkspace</Message>
            </MenuItem>
          </Fence>

          <Fence canEditWorkspace>
            <MenuItem
              tag={DeleteSpan}
              entityName={workspace.name}
              onClick={run(deleteWorkspaceAction)} icon='delete'>
              <Message>deleteWorkspace</Message>
            </MenuItem>
          </Fence>
        </DropdownMenu>
      </Gear>
    </ThumbLink>
  )
}
Workspace.displayName = 'Workspace'
Workspace.propTypes = {
  params: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  workspace: React.PropTypes.object.isRequired
}
Workspace.contextTypes = {
  router: React.PropTypes.object
}

export default node('workspaces', 'workspace', Workspace)
