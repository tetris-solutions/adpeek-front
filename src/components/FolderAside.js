import React from 'react'
import ContextMenu from './ContextMenu'

const {PropTypes} = React

export function FolderAside ({params: {company, workspace}}, {folder}) {
  if (!folder) return null
  const options = [{
    label: 'Edit',
    to: `/company/${company}/workspace/${workspace}/folder/${folder.id}/edit`
  }]

  return <ContextMenu title={folder.name} icon='folder' options={options}/>
}

FolderAside.displayName = 'Folder-Aside'
FolderAside.propTypes = {
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string
  })
}
FolderAside.contextTypes = {
  folder: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}

export default FolderAside
