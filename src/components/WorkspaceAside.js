import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import Fence from './Fence'
import DeleteButton from './DeleteButton'
import {deleteWorkspaceAction} from '../actions/delete-workspace'
import {contextualize} from './higher-order/contextualize'
import {Navigation, Button, Buttons, Name} from './Navigation'
import Recent from './Recent'
import isEmpty from 'lodash/isEmpty'

const {PropTypes} = React

export function WorkspaceAside ({params, workspace, dispatch}, {router}) {
  const {company} = params

  function onClick () {
    dispatch(deleteWorkspaceAction, workspace.id)
      .then(() => router.replace(`/company/${company}`))
  }

  const baseUrl = `/company/${company}/workspace/${workspace.id}`
  const linkToReportList = isEmpty(workspace.reports)
  const reportUrl = `${baseUrl}/${linkToReportList ? 'reports' : 'report/' + company.workspace[0].id}`

  return (
    <Fence canBrowseReports canEditWorkspace>{({canBrowseReports, canEditWorkspace}) =>
      <Navigation icon='domain'>
        <Name>
          {workspace.name}
        </Name>
        <br/>
        <Buttons>
          {canEditWorkspace && (
            <Button tag={Link} to={`/company/${company}/workspace/${workspace.id}/edit`} icon='mode_edit'>
              <Message>editWorkspace</Message>
            </Button>)}

          <Button tag={Link} to={`/company/${company}/workspace/${workspace.id}/orders`} icon='attach_money'>
            <Message>workspaceOrders</Message>
          </Button>

          {(canBrowseReports || !linkToReportList) && (
            <Button tag={Link} to={reportUrl} icon='show_chart'>
              <Message>workspaceReport</Message>
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
