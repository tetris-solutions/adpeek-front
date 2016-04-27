import React from 'react'
import {Link} from 'react-router'

const {PropTypes} = React

export function FolderAside ({params: {company, workspace}}, {folder}) {
  if (!folder) return null
  return (
    <header style={{textAlign: 'center'}}>
      <h5>{folder.name}</h5>
      <Link className='mdl-button' to={`/company/${company}/workspace/${workspace}/folder/${folder.id}/edit`}>
        Edit
      </Link>
    </header>
  )
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
