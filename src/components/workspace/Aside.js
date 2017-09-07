import Message from '@tetris/front-server/Message'
import React from 'react'
import PropTypes from 'prop-types'
import Fence from '../Fence'
import DeleteButton from '../DeleteButton'
import {deleteWorkspaceAction} from '../../actions/delete-workspace'
import {routeParamsBasedBranch} from '../higher-order/branch'
import {Navigation, NavLink, NavBt, NavBts, Name} from '../Navigation'
import Recent from '../Recent'
import ReportLink from '../report/Link'

export function WorkspaceAside ({params, workspace, dispatch}, {router}) {
  const {company} = params

  function onClick () {
    dispatch(deleteWorkspaceAction, params, workspace.id)
      .then(() => {
        router.replace(`/c/${company}`)
      })
  }

  const baseUrl = `/c/${company}/w/${workspace.id}`

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

          <ReportLink tag={NavLink} params={params} reports={workspace.reports} dispatch={dispatch}>
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

          <NavLink to={`/c/${company}`} icon='close'>
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

export default routeParamsBasedBranch('company', 'workspace', WorkspaceAside)
