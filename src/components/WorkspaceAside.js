import React from 'react'
import ContextMenu from './ContextMenu'

const {PropTypes} = React

export function WorkspaceAside ({params: {company}}, {workspace, messages: {editCallToAction}}) {
  if (!workspace) return null

  const options = [{
    label: editCallToAction,
    to: `/company/${company}/workspace/${workspace.id}/edit`
  }]

  return <ContextMenu title={workspace.name} icon='domain' options={options}/>
}

WorkspaceAside.displayName = 'Workspace-Aside'
WorkspaceAside.propTypes = {
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string
  })
}
WorkspaceAside.contextTypes = {
  messages: PropTypes.object,
  workspace: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}

export default WorkspaceAside
