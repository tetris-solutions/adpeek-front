import React from 'react'
import {Link} from 'react-router'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function WorkspaceBreadcrumb ({params: {company}, workspace}) {
  return (
    <Link to={`/company/${company}/workspace/${workspace.id}`}>
      {workspace.name}
    </Link>
  )
}

WorkspaceBreadcrumb.displayName = 'Workspace-Breadcrumb'
WorkspaceBreadcrumb.propTypes = {
  workspace: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  params: PropTypes.shape({
    company: PropTypes.string
  })
}

export default contextualize(WorkspaceBreadcrumb, 'workspace')
