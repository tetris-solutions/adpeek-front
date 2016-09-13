import endsWith from 'lodash/endsWith'
import Message from '@tetris/front-server/lib/components/intl/Message'
import React from 'react'
import {Link} from 'react-router'

import ContextMenu from './ContextMenu'
import DeleteButton from './DeleteButton'
import {deleteReportAction} from '../actions/delete-report'
import {loadFolderReportAction} from '../actions/load-folder-report'
import {setFolderReportAction} from '../actions/set-folder-report'
import {contextualize} from './higher-order/contextualize'
import ReportAccessControl from './ReportAccessControl'

const {PropTypes} = React

export function ReportAside ({report, dispatch, user}, {messages, router, location: {pathname}, params}) {
  const {company, workspace, folder} = params
  const folderUrl = `/company/${company}/workspace/${workspace}/folder/${folder}`
  const reload = () => dispatch(loadFolderReportAction, company, workspace, folder, report.id)
  const favorite = () => dispatch(setFolderReportAction, folder, report.id, true).then(reload)

  const deleteReport = () =>
    dispatch(deleteReportAction, report.id)
      .then(() => {
        router.push(`${folderUrl}/reports`)
      })

  return (
    <ContextMenu title={report.name} icon='trending_up'>
      <a className='mdl-navigation__link' onClick={favorite} title={report.is_user_selected ? messages.unfavoriteReportDescription : messages.favoriteReportDescription}>
        <i className='material-icons'>{report.is_user_selected ? 'star' : 'star_border'}</i>
        <Message>{report.is_user_selected ? 'unfavoriteReport' : 'favoriteReport'}</Message>
      </a>

      <ReportAccessControl dispatch={dispatch} reload={reload} params={params} report={report} user={user}/>

      {endsWith(pathname, '/edit') ? null : (
        <Link className='mdl-navigation__link' to={`${folderUrl}/report/${report.id}/edit`}>
          <i className='material-icons'>create</i>
          <Message>editReport</Message>
        </Link>
      )}

      <DeleteButton entityName={report.name} className='mdl-navigation__link' onClick={deleteReport}>
        <i className='material-icons'>delete</i>
        <Message>deleteReport</Message>
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
  messages: PropTypes.object,
  router: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object
}

export default contextualize(ReportAside, 'report', 'user')
