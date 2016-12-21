import Message from 'tetris-iso/Message'
import React from 'react'
import Fence from './Fence'
import DeleteButton from './DeleteButton'
import {deleteWorkspaceAction} from '../actions/delete-workspace'
import {contextualize} from './higher-order/contextualize'
import {Navigation, NavLink, NavBt, NavBts, Name} from './Navigation'
import Recent from './Recent'
import ReportLink from './Report/ReportLink'

const {PropTypes} = React

export function WorkspaceAside ({params, workspace, dispatch}, {router}) {
  const {company} = params

  function onClick () {
    dispatch(deleteWorkspaceAction, workspace.id)
      .then(() => router.replace(`/company/${company}`))
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
  router: PropTypes.object
}
WorkspaceAside.propTypes = {
  dispatch: PropTypes.func,
  workspace: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string
  })
}

export default contextualize(WorkspaceAside, 'workspace')
