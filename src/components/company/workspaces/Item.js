import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {routeParamsBasedBranch} from '../../higher-order/branch'
import style from './style'
import noop from 'lodash/noop'
import Message from 'tetris-iso/Message'
import {ThumbLink, BottomLine, Cap, Gear} from '../../ThumbLink'
import {deleteWorkspaceAction} from '../../../actions/delete-workspace'
import {unfavoriteWorkspaceAction} from '../../../actions/unfavorite-workspace'
import {favoriteWorkspaceAction} from '../../../actions/favorite-workspace'
import {DropdownMenu, MenuItem, HeaderMenuItem} from '../../DropdownMenu'
import ReportLink from '../../report/Link'
import {DeleteSpan} from '../../DeleteButton'
import Fence from '../../Fence'
import Stats from './Stats'
import {hideWorkspaceAction} from '../../../actions/hide-workspace'
import {showWorkspaceAction} from '../../../actions/show-workspace'

const Workspace = ({workspace, params, dispatch, reload}) => {
  const run = (action, after = noop) => () => dispatch(action, params).then(after)
  const summary = workspace.summary || {}

  return (
    <ThumbLink to={`/c/${params.company}/workspace/${workspace.id}`} title={workspace.name}>
      <Cap bg={workspace.hidden ? 'grey-500' : undefined}>
        {workspace.name}
      </Cap>

      <Stats {...workspace.stats}/>

      <BottomLine>
        <div className={style.label}>
          <Message>workspaceFoldersSummary</Message>:
        </div>

        <div className={style.numbers}>
          <img className={style.platform} src='/img/g-circle-32.png'/>
          <strong className={style.number}>
            {Number(summary.adwords || 0)}
          </strong>

          <img className={style.platform} src='/img/fb-circle-32.png'/>
          <strong className={style.number}>
            {Number(summary.facebook || 0)}
          </strong>

          {summary.analytics && <img className={style.platform} src='/img/ga-logo-32.png'/>}
          {summary.analytics && <strong className={style.number}>
            {Number(summary.analytics || 0)}
          </strong>}
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
            <MenuItem tag={Link} to={`/c/${params.company}/workspace/${workspace.id}/edit`} icon='mode_edit'>
              <Message>editWorkspace</Message>
            </MenuItem>
          </Fence>

          {workspace.hidden
            ? (
              <MenuItem icon='visibility' onClick={run(showWorkspaceAction, reload)}>
                <Message>showWorkspace</Message>
              </MenuItem>
            ) : (
              <MenuItem icon='visibility_off' onClick={run(hideWorkspaceAction, reload)}>
                <Message>hideWorkspace</Message>
              </MenuItem>
            )}

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
  reload: PropTypes.func,
  params: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  workspace: PropTypes.object.isRequired
}
Workspace.contextTypes = {
  router: PropTypes.object
}

export default routeParamsBasedBranch('workspaces', 'workspace', Workspace)
