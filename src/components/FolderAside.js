import React from 'react'
import ContextMenu from './ContextMenu'
import {contextualize} from './higher-order/contextualize'
import {Link} from 'react-router'
import {deleteFolderAction} from '../actions/delete-folder'

const {PropTypes} = React

export function FolderAside ({
  dispatch,
  folder,
  params: {company, workspace}
}, {router}) {
  function onClick () {
    dispatch(deleteFolderAction, folder.id)
      .then(() => {
        router.push(`/company/${company}/workspace/${workspace}`)
      })
  }
  const baseUrl = `/company/${company}/workspace/${workspace}/folder/${folder.id}`
  return (
    <ContextMenu title={folder.name} icon='folder'>
      <Link
        className='mdl-button mdl-js-button mdl-button--icon'
        to={`${baseUrl}/adgroups`}>
        <i className='material-icons'>receipt</i>
      </Link>

      <Link
        className='mdl-button mdl-js-button mdl-button--icon'
        to={`${baseUrl}/orders`}>
        <i className='material-icons'>attach_money</i>
      </Link>

      <Link
        className='mdl-button mdl-js-button mdl-button--icon'
        to={`${baseUrl}/edit`}>
        <i className='material-icons'>mode_edit</i>
      </Link>

      <button
        className='mdl-button mdl-js-button mdl-button--icon'
        onClick={onClick}>
        <i className='material-icons'>delete</i>
      </button>
    </ContextMenu>
  )
}

FolderAside.displayName = 'Folder-Aside'
FolderAside.contextTypes = {
  router: PropTypes.object
}
FolderAside.propTypes = {
  dispatch: PropTypes.func,
  folder: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string
  })
}

export default contextualize(FolderAside, 'folder')
