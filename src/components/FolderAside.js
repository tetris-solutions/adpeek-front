import React from 'react'
import ContextMenu from './ContextMenu'
import {contextualize} from './higher-order/contextualize'
import {Link} from 'react-router'
import {branch} from 'baobab-react/dist-modules/higher-order'
import {deleteFolderAction} from '../actions/delete-folder'

const {PropTypes} = React

export function FolderAside ({
  dispatch,
  router,
  folder,
  params: {company, workspace}
}) {
  function onClick () {
    dispatch(deleteFolderAction, folder.id)
      .then(() => {
        router.push(`/company/${company}/workspace/${workspace}`)
      })
  }

  return (
    <ContextMenu title={folder.name} icon='folder'>
      <Link
        className='mdl-button mdl-js-button mdl-button--icon'
        to={`/company/${company}/workspace/${workspace}/folder/${folder.id}`}>
        <i className='material-icons'>view_quilt</i>
      </Link>

      <Link
        className='mdl-button mdl-js-button mdl-button--icon'
        to={`/company/${company}/workspace/${workspace}/folder/${folder.id}/orders`}>
        <i className='material-icons'>attach_money</i>
      </Link>

      <Link
        className='mdl-button mdl-js-button mdl-button--icon'
        to={`/company/${company}/workspace/${workspace}/folder/${folder.id}/edit`}>
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
FolderAside.propTypes = {
  dispatch: PropTypes.func,
  router: PropTypes.object,
  folder: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string
  })
}

export default contextualize(branch({}, FolderAside), 'folder', 'router')
