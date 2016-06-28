import React from 'react'
import ContextMenu from './ContextMenu'
import {contextualize} from './higher-order/contextualize'
import {Link} from 'react-router'
import {deleteWorkspaceAction} from '../actions/delete-workspace'

const {PropTypes} = React

export function WorkspaceAside ({params: {company}, workspace, dispatch}, {router}) {
  function onClick () {
    dispatch(deleteWorkspaceAction, workspace.id)
      .then(() => {
        router.push(`/company/${company}`)
      })
  }

  return (
    <ContextMenu title={workspace.name} icon='domain'>
      <Link
        className='mdl-button mdl-js-button mdl-button--icon'
        to={`/company/${company}/workspace/${workspace.id}/edit`}>
        <i className='material-icons'>mode_edit</i>
      </Link>
      <Link
        className='mdl-button mdl-js-button mdl-button--icon'
        to={`/company/${company}/workspace/${workspace.id}/orders`}>
        <i className='material-icons'>attach_money</i>
      </Link>
      <button
        className='mdl-button mdl-js-button mdl-button--icon'
        onClick={onClick}>
        <i className='material-icons'>delete</i>
      </button>
    </ContextMenu>
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
