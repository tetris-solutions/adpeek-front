import Message from '@tetris/front-server/lib/components/intl/Message'
import React from 'react'
import {Link} from 'react-router'

import ContextMenu from './ContextMenu'
import DeleteButton from './DeleteButton'
import {deleteWorkspaceAction} from '../actions/delete-workspace'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function WorkspaceAside ({params: {company}, workspace, dispatch}, {router}) {
  function onClick () {
    dispatch(deleteWorkspaceAction, workspace.id)
      .then(() => {
        router.replace(`/company/${company}`)
      })
  }

  return (
    <ContextMenu title={workspace.name} icon='domain'>
      <Link className='mdl-navigation__link' to={`/company/${company}/workspace/${workspace.id}/edit`}>
        <i className='material-icons'>mode_edit</i>
        <Message>editWorkspace</Message>
      </Link>
      <Link className='mdl-navigation__link' to={`/company/${company}/workspace/${workspace.id}/orders`}>
        <i className='material-icons'>attach_money</i>
        <Message>workspaceOrders</Message>
      </Link>
      <DeleteButton entityName={workspace.name} className='mdl-navigation__link' onClick={onClick}>
        <i className='material-icons'>delete</i>
        <Message>deleteWorkspace</Message>
      </DeleteButton>
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
