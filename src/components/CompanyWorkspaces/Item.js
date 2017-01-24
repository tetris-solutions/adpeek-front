import React from 'react'
import {Link} from 'react-router'
import {contextualize} from '../higher-order/contextualize'
import style from './style'
import Message from 'tetris-iso/Message'
import {ThumbLink, BottomLine, Cap, Gear} from '../ThumbLink'
import {DropdownMenu, MenuItem, HeaderMenuItem} from '../DropdownMenu'
import ReportLink from '../Report/ReportLink'
import {DeleteSpan} from '../DeleteButton'
import Fence from '../Fence'
import Stats from './Stats'

const Workspace = ({workspace, params, del, fave, unfave, dispatch}) => (
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
        <HeaderMenuItem icon={workspace.favorite ? 'star' : 'star_border'} onClick={workspace.favorite ? unfave : fave}>
          <Message>
            {workspace.favorite ? 'unfaveWorkspace' : 'faveWorkspace'}
          </Message>
        </HeaderMenuItem>

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
          <MenuItem tag={DeleteSpan} entityName={workspace.name} onClick={del} icon='delete'>
            <Message>deleteWorkspace</Message>
          </MenuItem>
        </Fence>
      </DropdownMenu>
    </Gear>
  </ThumbLink>
)
Workspace.displayName = 'Workspace'
Workspace.propTypes = {
  params: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  workspace: React.PropTypes.object.isRequired,
  del: React.PropTypes.func.isRequired,
  fave: React.PropTypes.func.isRequired,
  unfave: React.PropTypes.func.isRequired
}
Workspace.contextTypes = {
  router: React.PropTypes.object
}

export default contextualize(Workspace, 'workspace')
