import React from 'react'
import {Link} from 'react-router'
import {node} from './higher-order/branch'

const FolderBreadcrumb = ({params: {company, workspace}, folder}, {messages: {folderBreadcrumb}}) => folder
  ? (
    <Link to={`/company/${company}/workspace/${workspace}/folder/${folder.id}`} title={folderBreadcrumb}>
      <i className='material-icons'>folder</i>
      {folder.name}
    </Link>
  ) : null

FolderBreadcrumb.displayName = 'Folder-Breadcrumb'
FolderBreadcrumb.propTypes = {
  folder: React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string
  }),
  params: React.PropTypes.shape({
    company: React.PropTypes.string,
    workspace: React.PropTypes.string
  })
}
FolderBreadcrumb.contextTypes = {
  messages: React.PropTypes.object
}

export default node('workspace', 'folder', FolderBreadcrumb)
