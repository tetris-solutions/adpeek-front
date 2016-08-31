import endsWith from 'lodash/endsWith'
import React from 'react'
import {Link} from 'react-router'

import ContextMenu from './ContextMenu'
import DeleteButton from './DeleteButton'
import {deleteReportAction} from '../actions/delete-report'
import {loadFolderReportAction} from '../actions/load-folder-report'
import {openReportAction} from '../actions/open-report'
import {setFolderReportAction} from '../actions/set-folder-report'
import {updateReportAction} from '../actions/update-report'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function ReportAside ({report, dispatch, user}, {router, location: {pathname}, params: {company, workspace, folder}}) {
  const folderUrl = `/company/${company}/workspace/${workspace}/folder/${folder}`
  const reload = () =>
    dispatch(loadFolderReportAction, company, workspace, folder, report.id)

  const makePublic = () =>
    dispatch(openReportAction, report.id)
      .then(reload)

  const favorite = () =>
    dispatch(setFolderReportAction, folder, report.id, true)
      .then(reload)

  const setAsFolderDefault = () =>
    dispatch(setFolderReportAction, folder, report.id)
      .then(reload)

  const unlock = () =>
    dispatch(updateReportAction, {id: report.id, is_private: false})

  const deleteReport = () =>
    dispatch(deleteReportAction, report.id)
      .then(() => {
        router.push(`${folderUrl}/reports`)
      })

  return (
    <ContextMenu title={report.name} icon='trending_up'>
      {!report.is_global && user.is_admin ? (
        <button
          className='mdl-button mdl-js-button mdl-button--icon'
          onClick={makePublic}>
          <i className='material-icons'>public</i>
        </button>) : null}

      {report.is_private ? (
        <button className='mdl-button mdl-js-button mdl-button--icon' onClick={unlock}>
          <i className='material-icons'>lock_outline</i>
        </button>
      ) : (
        <button className='mdl-button mdl-js-button mdl-button--icon' onClick={setAsFolderDefault}>
          <i className='material-icons'>
            {report.is_folder_report ? 'check_box' : 'indeterminate_check_box'}
          </i>
        </button>
      )}

      <button
        className='mdl-button mdl-js-button mdl-button--icon'
        onClick={favorite}>
        <i className='material-icons'>{report.is_user_selected ? 'star' : 'star_border'}</i>
      </button>

      {endsWith(pathname, '/edit') ? null : (
        <Link
          className='mdl-button mdl-js-button mdl-button--icon'
          to={`${folderUrl}/report/${report.id}/edit`}>
          <i className='material-icons'>create</i>
        </Link>
      )}

      <DeleteButton
        entityName={report.name}
        className='mdl-button mdl-js-button mdl-button--icon'
        onClick={deleteReport}>
        <i className='material-icons'>delete</i>
      </DeleteButton>
    </ContextMenu>
  )
}

ReportAside.displayName = 'Report-Aside'
ReportAside.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.object,
  report: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}
ReportAside.contextTypes = {
  router: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object
}

export default contextualize(ReportAside, 'report', 'user')
