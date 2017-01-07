import endsWith from 'lodash/endsWith'
import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import TextMessage from 'intl-messageformat'
import Fence from '../Fence'
import DeleteButton from '../DeleteButton'
import {deleteReportAction} from '../../actions/delete-report'
import {contextualize} from '../higher-order/contextualize'
import ReportEditPrompt from './EditPrompt'
import {Name, Navigation, NavBt, NavBts} from '../Navigation'
import {canSkipReportEditPrompt} from '../../functions/can-skip-report-edit-prompt'
import NameInput from './NameInput'
import compact from 'lodash/compact'
import join from 'lodash/join'
const createModule = () => window.event$.emit('report.onNewModuleClick')

export function ReportAside ({report, dispatch}, {messages, locales, router, location: {pathname, search}, params}) {
  const {company, workspace, folder} = params

  const scopeUrl = '/' +
    join(compact([
      `company/${company}`,
      workspace && `workspace/${workspace}`,
      folder && `folder/${folder}`
    ]), '/')

  const deleteReport = () => {
    router.push(`${scopeUrl}/reports`)
    dispatch(deleteReportAction, params, report.id)
  }

  const inEditMode = endsWith(pathname, '/edit')
  const cloneName = new TextMessage(messages.copyOfName, locales).format({name: report.name})
  const shouldSkipEditPrompt = report.is_private || canSkipReportEditPrompt()

  const cloneUrl = `${scopeUrl}/reports/new?clone=${report.id}&name=${cloneName}`
  const reportUrl = `${scopeUrl}/report/${report.id}`

  return (
    <Fence canEditReport canBrowseReports>
      {({canEditReport, canBrowseReports}) =>
        <Navigation icon='trending_up'>
          {inEditMode
            ? <NameInput dispatch={dispatch} params={params} report={report}/>
            : (
              <div>
                <Name>{report.name}</Name>

                {report.description &&
                <blockquote
                  style={{fontSize: '10pt', margin: '0 2em'}}
                  dangerouslySetInnerHTML={{__html: report.description.replace(/\n/g, '<br/>')}}/>}

                <hr/>
              </div>
            )}

          <NavBts>
            {inEditMode && canEditReport && (
              <NavBt onClick={createModule} icon='add'>
                <Message>newModule</Message>
              </NavBt>)}

            {canEditReport && !inEditMode && shouldSkipEditPrompt && (
              <NavBt tag={Link} to={`${reportUrl}/edit${search}`} icon='create'>
                <Message>editReport</Message>
              </NavBt>)}

            {canEditReport && !inEditMode && !shouldSkipEditPrompt && (
              <NavBt tag={ReportEditPrompt} report={report} params={params} icon='create'/>)}

            {canEditReport && <NavBt tag={Link} to={cloneUrl} icon='content_copy'>
              <Message>cloneReport</Message>
            </NavBt>}

            {canEditReport && (
              <NavBt tag={DeleteButton} entityName={report.name} onClick={deleteReport} icon='delete'>
                <Message>deleteReport</Message>
              </NavBt>)}

            <NavBt tag={Link} to={inEditMode ? reportUrl : (canBrowseReports ? `${scopeUrl}/reports` : scopeUrl)} icon='close'>
              <Message>oneLevelUpNavigation</Message>
            </NavBt>
          </NavBts>
        </Navigation>}
    </Fence>
  )
}

ReportAside.displayName = 'Report-Aside'
ReportAside.propTypes = {
  dispatch: React.PropTypes.func,
  user: React.PropTypes.object,
  report: React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string
  })
}
ReportAside.contextTypes = {
  messages: React.PropTypes.object,
  locales: React.PropTypes.string,
  router: React.PropTypes.object,
  location: React.PropTypes.object,
  params: React.PropTypes.object
}

export default contextualize(ReportAside, 'report', 'user')
