import isEmpty from 'lodash/isEmpty'
import Message from '@tetris/front-server/lib/components/intl/Message'
import React from 'react'
import {Link} from 'react-router'
import endsWith from 'lodash/endsWith'
import Fence from './Fence'

import ContextMenu from './ContextMenu'
import DeleteButton from './DeleteButton'
import {deleteFolderAction} from '../actions/delete-folder'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function FolderAside ({
  dispatch,
  folder,
  params: {company, workspace}
}, {router, location}) {
  function onClick () {
    dispatch(deleteFolderAction, folder.id)
      .then(() => {
        router.replace(`/company/${company}/workspace/${workspace}`)
      })
  }

  const baseUrl = `/company/${company}/workspace/${workspace}/folder/${folder.id}`
  const linkToReportList = isEmpty(folder.reports)

  const reportUrl = `${baseUrl}/${linkToReportList ? 'reports' : 'report/' + folder.reports[0].id}`
  const backspaceUrl = endsWith(location.pathname, folder.id)
    ? `/company/${company}/workspace/${workspace}`
    : baseUrl

  return (
    <Fence canEditFolder canBrowseReports>
      {({canEditFolder, canBrowseReports}) =>
        <ContextMenu title={folder.name} icon='folder'>
          <Link className='mdl-navigation__link' to={`${baseUrl}/adgroups`}>
            <i className='material-icons'>receipt</i>
            <Message>folderAds</Message>
          </Link>

          <Link className='mdl-navigation__link' to={`${baseUrl}/orders`}>
            <i className='material-icons'>attach_money</i>
            <Message>folderOrders</Message>
          </Link>

          {(canBrowseReports || !linkToReportList) && (
            <Link className='mdl-navigation__link' to={reportUrl}>
              <i className='material-icons'>show_chart</i>
              <Message>folderReport</Message>
            </Link>)}

          {canEditFolder && <Link className='mdl-navigation__link' to={`${baseUrl}/edit`}>
            <i className='material-icons'>mode_edit</i>
            <Message>editFolder</Message>
          </Link>}

          {canEditFolder && <DeleteButton entityName={folder.name} className='mdl-navigation__link' onClick={onClick}>
            <i className='material-icons'>delete</i>
            <Message>deleteFolder</Message>
          </DeleteButton>}

          <Link className='mdl-navigation__link' to={backspaceUrl}>
            <i className='material-icons'>close</i>
            <Message>oneLevelUpNavigation</Message>
          </Link>
        </ContextMenu>}
    </Fence>
  )
}

FolderAside.displayName = 'Folder-Aside'
FolderAside.contextTypes = {
  router: PropTypes.object,
  location: PropTypes.object
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
