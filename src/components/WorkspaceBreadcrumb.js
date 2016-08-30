import React from 'react'
import {Link} from 'react-router'

import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function WorkspaceBreadcrumb ({params: {company}, workspace}, {messages: {workspaceBreadcrumb}}) {
  return (
    <Link to={`/company/${company}/workspace/${workspace.id}`} title={workspaceBreadcrumb}>
      <i className='material-icons'>domain</i>
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
WorkspaceBreadcrumb.contextTypes = {
  messages: PropTypes.object
}

export default contextualize(WorkspaceBreadcrumb, 'workspace')
