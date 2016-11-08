import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import Fence from './Fence'
import DeleteButton from './DeleteButton'
import {deleteWorkspaceAction} from '../actions/delete-workspace'
import {contextualize} from './higher-order/contextualize'
import {Navigation, Button, Buttons, Name} from './Navigation'
import Recent from './Recent'
import ReportLink from './Report/LinkToReports'

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
        <Buttons>
          <Button tag={Link} to={`${baseUrl}/orders`} icon='attach_money'>
            <Message>workspaceOrders</Message>
          </Button>

          <ReportLink params={params} reports={workspace.reports} dispatch={dispatch}>
            <Message>workspaceReport</Message>
          </ReportLink>

          {canEditWorkspace && (
            <Button tag={Link} to={`${baseUrl}/edit`} icon='mode_edit'>
              <Message>editWorkspace</Message>
            </Button>)}

          {canEditWorkspace && (
            <Button tag={DeleteButton} entityName={workspace.name} onClick={onClick} icon='delete'>
              <Message>deleteWorkspace</Message>
            </Button>)}

          <Button tag={Link} to={`/company/${company}`} icon='close'>
            <Message>oneLevelUpNavigation</Message>
          </Button>
        </Buttons>
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
