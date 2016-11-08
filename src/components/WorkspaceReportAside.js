import endsWith from 'lodash/endsWith'
import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import TextMessage from 'intl-messageformat'
import Fence from './Fence'
import DeleteButton from './DeleteButton'
import {deleteReportAction} from '../actions/delete-report'
import {loadReportAction} from '../actions/load-report'
import {setDefaultReportAction} from '../actions/set-default-report'
import {contextualize} from './higher-order/contextualize'
import ReportAccessControl from './Report/AccessControl'
import ReportEditPrompt from './Report/EditPrompt'
import {Name, Navigation, Button, Buttons} from './Navigation'
import {canSkipReportEditPrompt} from '../functions/can-skip-report-edit-prompt'

const {PropTypes} = React

export function WorkspaceReportAside ({report, dispatch, user}, {messages, locales, router, location: {pathname}, params}) {
  const {company, workspace} = params
  const workspaceUrl = `/company/${company}/workspace/${workspace}`
  const reload = () => dispatch(loadReportAction, params, report.id)
  const favorite = () => dispatch(setDefaultReportAction, params, report.id, true).then(reload)

  const deleteReport = () =>
    dispatch(deleteReportAction, params, report.id)
      .then(() => router.push(`${workspaceUrl}/reports`))

  const inEditMode = endsWith(pathname, '/edit')
  const cloneName = new TextMessage(messages.copyOfName, locales).format({name: report.name})
  const shouldSkipEditPrompt = report.is_private || canSkipReportEditPrompt()
  const favTitle = report.is_user_selected ? messages.unfavoriteReportDescription : messages.favoriteReportDescription
  const cloneUrl = `${workspaceUrl}/reports/new?clone=${report.id}&name=${cloneName}`

  return (
    <Fence canEditReport canBrowseReports>
      {({canEditReport, canBrowseReports}) =>
        <Navigation icon='trending_up'>
          <Name>{report.name}</Name>

          <Buttons>
            {canBrowseReports && (
              <Button onClick={favorite} title={favTitle} icon={report.is_user_selected ? 'star' : 'star_border'}>
                <Message>{report.is_user_selected ? 'unfavoriteReport' : 'favoriteReport'}</Message>
              </Button>)}

            {canEditReport && (
              <Button
                icon='share'
                tag={ReportAccessControl}
                dispatch={dispatch}
                reload={reload}
                params={params}
                report={report}
                user={user}/>)}

            {canEditReport && <Button tag={Link} to={cloneUrl} icon='content_copy'>
              <Message>cloneReport</Message>
            </Button>}

            {canEditReport && !inEditMode && shouldSkipEditPrompt && (
              <Button tag={Link} to={`${workspaceUrl}/report/${report.id}/edit`} icon='create'>
                <Message>editReport</Message>
              </Button>)}

            {canEditReport && !inEditMode && !shouldSkipEditPrompt && (
              <Button tag={ReportEditPrompt} report={report} params={params} icon='create'/>)}

            {canEditReport && (
              <Button tag={DeleteButton} entityName={report.name} onClick={deleteReport} icon='delete'>
                <Message>deleteReport</Message>
              </Button>)}

            <Button tag={Link} to={canBrowseReports ? `${workspaceUrl}/reports` : workspaceUrl} icon='close'>
              <Message>oneLevelUpNavigation</Message>
            </Button>
          </Buttons>
        </Navigation>}
    </Fence>
  )
}

WorkspaceReportAside.displayName = 'Workspace-Report-Aside'
WorkspaceReportAside.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.object,
  report: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}
WorkspaceReportAside.contextTypes = {
  messages: PropTypes.object,
  locales: PropTypes.string,
  router: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object
}

export default contextualize(WorkspaceReportAside, 'report', 'user')
