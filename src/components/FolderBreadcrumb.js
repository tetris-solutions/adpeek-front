import React from 'react'
import {Link} from 'react-router'

import {contextualize} from './higher-order/contextualize'

const FolderBreadcrumb = ({params: {company, workspace}, folder}, {messages: {folderBreadcrumb}}) => folder && (
  <Link to={`/company/${company}/workspace/${workspace}/folder/${folder.id}`} title={folderBreadcrumb}>
    <i className='material-icons'>folder</i>
    {folder.name}
  </Link>
)

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

export default contextualize(FolderBreadcrumb, 'folder')
