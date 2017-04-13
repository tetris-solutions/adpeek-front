import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {node} from '../higher-order/branch'

const WorkspaceBreadcrumb = ({params: {company}, workspace}, {messages: {workspaceBreadcrumb}}) => workspace
  ? (
    <Link to={`/company/${company}/workspace/${workspace.id}`} title={workspaceBreadcrumb}>
      <i className='material-icons'>domain</i>
      {workspace.name}
    </Link>
  ) : null

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

export default node('company', 'workspace', WorkspaceBreadcrumb)
