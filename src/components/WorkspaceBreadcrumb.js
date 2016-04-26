import React from 'react'
import {Link} from 'react-router'

const {PropTypes} = React

export function WorkspaceBreadcrumb ({params: {company}}, {workspace}) {
  if (!workspace) return null
  return (
    <Link to={`/company/${company}/workspace/${workspace.id}`}>
      {workspace.name}
    </Link>
  )
}

WorkspaceBreadcrumb.displayName = 'Workspace-CompanyBreadcrumb'
WorkspaceBreadcrumb.contextTypes = {
  workspace: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}
WorkspaceBreadcrumb.propTypes = {
  params: PropTypes.shape({
    company: PropTypes.string
  })
}

export default WorkspaceBreadcrumb
