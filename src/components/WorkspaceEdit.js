import React from 'react'

const {PropTypes} = React

export function WorkspaceEdit (props, {workspace: {id, name}}) {
  return (
    <section>
      <h3>{id} ::: {name}</h3>
    </section>
  )
}

WorkspaceEdit.displayName = 'Workspace-Edit'
WorkspaceEdit.contextTypes = {
  workspace: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}

export default WorkspaceEdit
