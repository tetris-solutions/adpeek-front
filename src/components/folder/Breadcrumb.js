import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {node} from '../higher-order/branch'

const FolderBreadcrumb = ({params: {company, workspace}, folder}, {messages: {folderBreadcrumb}}) => folder
  ? (
    <Link to={`/company/${company}/workspace/${workspace}/folder/${folder.id}`} title={folderBreadcrumb}>
      <i className='material-icons'>folder</i>
      {folder.name}
    </Link>
  ) : null

FolderBreadcrumb.displayName = 'Folder-Breadcrumb'
FolderBreadcrumb.propTypes = {
  folder: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string
  })
}
FolderBreadcrumb.contextTypes = {
  messages: PropTypes.object
}

export default node('workspace', 'folder', FolderBreadcrumb)
