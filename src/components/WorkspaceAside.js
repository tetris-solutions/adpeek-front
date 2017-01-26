import Message from 'tetris-iso/Message'
import React from 'react'
import Fence from './Fence'
import DeleteButton from './DeleteButton'
import {deleteWorkspaceAction} from '../actions/delete-workspace'
import {contextualize} from './higher-order/contextualize'
import {Navigation, NavLink, NavBt, NavBts, Name} from './Navigation'
import Recent from './Recent'
import ReportLink from './Report/ReportLink'

export function WorkspaceAside ({params, workspace, dispatch}, {router}) {
  const {company} = params

  function onClick () {
    dispatch(deleteWorkspaceAction, params, workspace.id)
      .then(() => {
        router.replace(`/company/${company}`)
      })
  }

  const baseUrl = `/company/${company}/workspace/${workspace.id}`

  return (
    <Fence canEditWorkspace>{({canEditWorkspace}) =>
      <Navigation icon='domain'>
        <Name>
          {workspace.name}
        </Name>
        <br/>
        <NavBts>
          <NavLink to={`${baseUrl}/orders`} icon='attach_money'>
            <Message>workspaceOrders</Message>
          </NavLink>

          <ReportLink tag={NavBt} params={params} reports={workspace.reports} dispatch={dispatch}>
            <Message>workspaceReport</Message>
          </ReportLink>

          {canEditWorkspace && (
            <NavLink to={`${baseUrl}/edit`} icon='mode_edit'>
              <Message>editWorkspace</Message>
            </NavLink>)}

          {canEditWorkspace && (
            <NavBt tag={DeleteButton} entityName={workspace.name} onClick={onClick} icon='delete'>
              <Message>deleteWorkspace</Message>
            </NavBt>)}

          <NavLink to={`/company/${company}`} icon='close'>
            <Message>oneLevelUpNavigation</Message>
          </NavLink>
        </NavBts>
        <br/>
        <hr/>
        <Recent
          params={params}
          dispatch={dispatch}
          icon='folder'
          level='folder'
          node={workspace}/>
      </Navigation>}
    </Fence>
  )
}

WorkspaceAside.displayName = 'Workspace-Aside'
WorkspaceAside.contextTypes = {
  router: React.PropTypes.object
}
WorkspaceAside.propTypes = {
  dispatch: React.PropTypes.func,
  workspace: React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string
  }),
  params: React.PropTypes.shape({
    company: React.PropTypes.string,
    workspace: React.PropTypes.string
  })
}

export default contextualize(WorkspaceAside, 'workspace')
