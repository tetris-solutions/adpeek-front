import React from 'react'
import {Link} from 'react-router'

const {PropTypes} = React

export function FolderBreadcrumb ({params: {company, workspace}}, {folder}) {
  if (!folder) return null
  return (
    <Link to={`/company/${company}/workspace/${workspace}/folder/${folder.id}`}>
      {folder.name}
    </Link>
  )
}

FolderBreadcrumb.displayName = 'Folder-CompanyBreadcrumb'
FolderBreadcrumb.contextTypes = {
  folder: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}

FolderBreadcrumb.propTypes = {
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string
  })
}

export default FolderBreadcrumb
