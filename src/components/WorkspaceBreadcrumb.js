import React from 'react'
import {Link} from 'react-router'
import {node} from './higher-order/branch'

const WorkspaceBreadcrumb = ({params: {company}, workspace}, {messages: {workspaceBreadcrumb}}) => workspace && (
  <Link to={`/company/${company}/workspace/${workspace.id}`} title={workspaceBreadcrumb}>
    <i className='material-icons'>domain</i>
    {workspace.name}
  </Link>
)

WorkspaceBreadcrumb.displayName = 'Workspace-Breadcrumb'
WorkspaceBreadcrumb.propTypes = {
  workspace: React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string
  }),
  params: React.PropTypes.shape({
    company: React.PropTypes.string
  })
}
WorkspaceBreadcrumb.contextTypes = {
  messages: React.PropTypes.object
}

export default node('company', 'workspace', WorkspaceBreadcrumb)
