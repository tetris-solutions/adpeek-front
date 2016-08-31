import isEmpty from 'lodash/isEmpty'
import React from 'react'
import {Link} from 'react-router'

import ContextMenu from './ContextMenu'
import DeleteButton from './DeleteButton'
import {deleteFolderAction} from '../actions/delete-folder'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function FolderAside ({
  dispatch,
  folder,
  params: {company, workspace}
}, {router}) {
  function onClick () {
    dispatch(deleteFolderAction, folder.id)
      .then(() => {
        router.replace(`/company/${company}/workspace/${workspace}`)
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
        to={`${baseUrl}/${isEmpty(folder.reports) ? 'reports' : 'report/' + folder.reports[0].id}`}>
        <i className='material-icons'>show_chart</i>
      </Link>

      <Link
        className='mdl-button mdl-js-button mdl-button--icon'
        to={`${baseUrl}/edit`}>
        <i className='material-icons'>mode_edit</i>
      </Link>

      <DeleteButton
        entityName={folder.name}
        className='mdl-button mdl-js-button mdl-button--icon'
        onClick={onClick}>
        <i className='material-icons'>delete</i>
      </DeleteButton>
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
