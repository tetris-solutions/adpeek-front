import React from 'react'
import ContextMenu from './ContextMenu'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function WorkspaceAside ({params: {company}, workspace, messages: {editCallToAction}}) {
  const options = [{
    label: editCallToAction,
    to: `/company/${company}/workspace/${workspace.id}/edit`
  }]

  return <ContextMenu title={workspace.name} icon='domain' options={options}/>
}

WorkspaceAside.displayName = 'Workspace-Aside'
WorkspaceAside.propTypes = {
  messages: PropTypes.object,
  workspace: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string
  })
}

export default contextualize(WorkspaceAside, 'workspace', 'messages')
