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
import replace from 'lodash/replace'
import ModulesIndex from './ModulesIndex'
import Icon from './Icon'

const createModule = () => window.event$.emit('report.onNewModuleClick')
const withLineBreaks = str => replace(str, /\n/g, '<br/>')
const blockStyle = {fontSize: '10pt', margin: '0 2em'}

const ReportHeader = props => {
  if (props.inEditMode) {
    return <NameInput {...props}/>
  }

  const {report: {name, description}} = props

  return (
    <div>
      <Name>{name}</Name>

      {description && (
        <blockquote
          style={blockStyle}
          dangerouslySetInnerHTML={{__html: withLineBreaks(description)}}/>
      )}

      <hr/>
    </div>
  )
}

ReportHeader.displayName = 'Header'
ReportHeader.propTypes = {
  report: React.PropTypes.object.isRequired,
  inEditMode: React.PropTypes.bool.isRequired
}

export function ReportAside ({report, user, dispatch}, {messages, locales, router, location: {pathname, search}, params}) {
  const {company, workspace, folder} = params

  const scopeUrl = '/' +
    join(compact([
      `company/${company}`,
      workspace && `workspace/${workspace}`,
      folder && `folder/${folder}`
    ]), '/')

  const deleteReport = () => {
    dispatch(deleteReportAction, params, report.id)
      .then(() => {
        router.push(`${scopeUrl}/reports`)
      })
  }

  const inEditMode = endsWith(pathname, '/edit')
  const cloneName = new TextMessage(messages.copyOfName, locales).format({name: report.name})
  const shouldSkipEditPrompt = report.is_private || canSkipReportEditPrompt()

  const cloneUrl = `${scopeUrl}/reports/new?clone=${report.id}&name=${cloneName}`
  const reportUrl = `${scopeUrl}/report/${report.id}`

  /* eslint-disable */
  function navigation ({canEditReport, canBrowseReports}) {
    /* eslint-enable */

    const isGlobalReport = !report.company
    const canCloneReport = canEditReport

    if (isGlobalReport && !user.is_admin) {
      canEditReport = false
    }

    let backUrl = `${reportUrl}${search}`

    if (!inEditMode) {
      backUrl = canBrowseReports ? `${scopeUrl}/reports` : scopeUrl
    }

    return (
      <Navigation icon={<Icon {...report}/>}>
        <ReportHeader {...{dispatch, params, report, inEditMode}}/>

        <NavBts>
          <ModulesIndex/>

          {inEditMode && canEditReport && (
            <NavBt onClick={createModule} icon='add'>
              <Message>newModule</Message>
            </NavBt>)}

          {canEditReport && !inEditMode && shouldSkipEditPrompt && (
            <NavBt tag={Link} to={`${reportUrl}/edit${search}`} icon='create'>
              <Message>editReport</Message>
            </NavBt>)}

          {canEditReport && !inEditMode && !shouldSkipEditPrompt && (
            <NavBt
              tag={ReportEditPrompt}
              report={report}
              params={params}
              icon='create'/>)}

          {canCloneReport && (
            <NavBt tag={Link} to={cloneUrl} icon='content_copy'>
              <Message>cloneReport</Message>
            </NavBt>)}

          {canEditReport && (
            <NavBt tag={DeleteButton} entityName={report.name} onClick={deleteReport} icon='delete'>
              <Message>deleteReport</Message>
            </NavBt>)}

          <NavBt
            tag={Link}
            to={backUrl}
            icon='close'>
            <Message>oneLevelUpNavigation</Message>
          </NavBt>
        </NavBts>
      </Navigation>
    )
  }

  return <Fence canEditReport canBrowseReports>{navigation}</Fence>
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
