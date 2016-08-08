import React from 'react'
import ContextMenu from './ContextMenu'
import {contextualize} from './higher-order/contextualize'
import {deleteReportAction} from '../actions/delete-report'
import {setFolderReportAction} from '../actions/set-folder-report'
import {loadFolderReportAction} from '../actions/load-folder-report'
import {updateReportAction} from '../actions/update-report'

const {PropTypes} = React

export function ReportAside ({report, dispatch}, {router, params: {company, workspace, folder}}) {
  const reload = () =>
    dispatch(loadFolderReportAction, company, workspace, folder, report.id)

  const favorite = () =>
    dispatch(setFolderReportAction, folder, report.id, true)
      .then(reload)

  const setAsFolderDefault = () =>
    dispatch(setFolderReportAction, folder, report.id)
      .then(reload)

  const unlock = () =>
    dispatch(updateReportAction, {id: report.id, is_private: false})
      .then(reload)

  const deleteReport = () =>
    dispatch(deleteReportAction, report.id)
      .then(() => {
        router.push(`/company/${company}/workspace/${workspace}/folder/${folder}/reports`)
      })

  return (
    <ContextMenu title={report.name} icon='trending_up'>
      {report.is_private ? (
        <button
          className='mdl-button mdl-js-button mdl-button--icon'
          onClick={unlock}>
          <i className='material-icons'>lock_outline</i>
        </button>
      ) : (
        <button
          className='mdl-button mdl-js-button mdl-button--icon'
          onClick={setAsFolderDefault}>
          <i className='material-icons'>{report.is_folder_report ? 'check_box' : 'check_box_outline_blank'}</i>
        </button>
      )}
      <button
        className='mdl-button mdl-js-button mdl-button--icon'
        onClick={favorite}>
        <i className='material-icons'>{report.is_user_selected ? 'star' : 'star_border'}</i>
      </button>
      <button
        className='mdl-button mdl-js-button mdl-button--icon'
        onClick={deleteReport}>
        <i className='material-icons'>delete</i>
      </button>
    </ContextMenu>
  )
}

ReportAside.displayName = 'Report-Aside'
ReportAside.propTypes = {
  dispatch: PropTypes.func,
  report: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}
ReportAside.contextTypes = {
  router: PropTypes.object,
  params: PropTypes.object
}

export default contextualize(ReportAside, 'report')
