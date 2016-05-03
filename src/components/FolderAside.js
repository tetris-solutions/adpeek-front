import React from 'react'
import ContextMenu from './ContextMenu'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function FolderAside ({
  folder,
  params: {company, workspace},
  messages: {editCallToAction}
}) {
  const options = [{
    label: editCallToAction,
    to: `/company/${company}/workspace/${workspace}/folder/${folder.id}/edit`
  }]

  return <ContextMenu title={folder.name} icon='folder' options={options}/>
}

FolderAside.displayName = 'Folder-Aside'
FolderAside.propTypes = {
  messages: PropTypes.object,
  folder: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string
  })
}

export default contextualize(FolderAside, 'folder', 'messages')
