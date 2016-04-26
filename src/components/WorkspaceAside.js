import React from 'react'
import {Link} from 'react-router'

const {PropTypes} = React

export function WorkspaceAside ({params: {company}}, {workspace}) {
  if (!workspace) return null
  return (
    <header style={{textAlign: 'center'}}>
      <h5>{workspace.name}</h5>
      <Link className='mdl-button' to={`/company/${company}/workspace/${workspace.id}/edit`}>
        Edit
      </Link>
    </header>
  )
}

WorkspaceAside.displayName = 'Workspace-Aside'
WorkspaceAside.propTypes = {
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string
  })
}
WorkspaceAside.contextTypes = {
  workspace: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}

export default WorkspaceAside
