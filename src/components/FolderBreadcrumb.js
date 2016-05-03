import React from 'react'
import {Link} from 'react-router'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function FolderBreadcrumb ({params: {company, workspace}, folder}) {
  return (
    <Link to={`/company/${company}/workspace/${workspace}/folder/${folder.id}`}>
      {folder.name}
    </Link>
  )
}

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

export default contextualize(FolderBreadcrumb, 'folder')
