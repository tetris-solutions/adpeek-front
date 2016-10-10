import endsWith from 'lodash/endsWith'
import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import TextMessage from 'intl-messageformat'
import Fence from './Fence'
import ContextMenu from './ContextMenu'
import DeleteButton from './DeleteButton'
import {deleteReportAction} from '../actions/delete-report'
import {loadFolderReportAction} from '../actions/load-folder-report'
import {setFolderReportAction} from '../actions/set-folder-report'
import {contextualize} from './higher-order/contextualize'
import ReportAccessControl from './ReportAccessControl'
import ReportEditPrompt from './ReportEditPrompt'

const {PropTypes} = React

function canSkipReportEditPrompt () {
  if (typeof window === 'undefined') return false

  try {
    return Boolean(window.localStorage.skipReportEditPrompt)
  } catch (e) {
    return false
  }
}

export function ReportAside ({report, dispatch, user}, {messages, locales, router, location: {pathname}, params}) {
  const {company, workspace, folder} = params
  const folderUrl = `/company/${company}/workspace/${workspace}/folder/${folder}`
  const reload = () => dispatch(loadFolderReportAction, company, workspace, folder, report.id)
  const favorite = () => dispatch(setFolderReportAction, folder, report.id, true).then(reload)

  const deleteReport = () =>
    dispatch(deleteReportAction, params, report.id)
      .then(() => {
        router.push(`${folderUrl}/reports`)
      })

  const inEditMode = endsWith(pathname, '/edit')
  const cloneName = new TextMessage(messages.copyOfName, locales).format({name: report.name})
  const shouldSkipEditPrompt = report.is_private || canSkipReportEditPrompt()
  const favTitle = report.is_user_selected ? messages.unfavoriteReportDescription : messages.favoriteReportDescription
  const cloneUrl = `${folderUrl}/reports/new?clone=${report.id}&name=${cloneName}`

  return (
    <Fence canEditReport canBrowseReports>
      {({canEditReport, canBrowseReports}) =>
        <ContextMenu title={report.name} icon='trending_up'>
          {canBrowseReports && <a className='mdl-navigation__link' onClick={favorite} title={favTitle}>
            <i className='material-icons'>{report.is_user_selected ? 'star' : 'star_border'}</i>
            <Message>{report.is_user_selected ? 'unfavoriteReport' : 'favoriteReport'}</Message>
          </a>}

          {canEditReport && (
            <ReportAccessControl
              dispatch={dispatch}
              reload={reload}
              params={params}
              report={report}
              user={user}/>)}

          {canEditReport && <Link className='mdl-navigation__link' to={cloneUrl}>
            <i className='material-icons'>content_copy</i>
            <Message>cloneReport</Message>
          </Link>}

          {canEditReport && !inEditMode && shouldSkipEditPrompt && (
            <Link className='mdl-navigation__link' to={`${folderUrl}/report/${report.id}/edit`}>
              <i className='material-icons'>create</i>
              <Message>editReport</Message>
            </Link>)}

          {canEditReport && !inEditMode && !shouldSkipEditPrompt && (
            <ReportEditPrompt report={report} params={params}/>)}

          {canEditReport && (
            <DeleteButton entityName={report.name} className='mdl-navigation__link' onClick={deleteReport}>
              <i className='material-icons'>delete</i>
              <Message>deleteReport</Message>
            </DeleteButton>)}

          <Link className='mdl-navigation__link' to={canBrowseReports ? `${folderUrl}/reports` : folderUrl}>
            <i className='material-icons'>close</i>
            <Message>oneLevelUpNavigation</Message>
          </Link>
        </ContextMenu>}
    </Fence>
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
  messages: PropTypes.object,
  locales: PropTypes.string,
  router: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object
}

export default contextualize(ReportAside, 'report', 'user')
