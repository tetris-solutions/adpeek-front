import endsWith from 'lodash/endsWith'
import Message from '@tetris/front-server/Message'
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import TextMessage from 'intl-messageformat'
import Fence from '../Fence'
import DeleteButton from '../DeleteButton'
import {deleteReportAction} from '../../actions/delete-report'
import {inferLevelFromProps} from '../../functions/infer-level-from-params'
import {many} from '../higher-order/branch'
import ReportEditPrompt from './EditPrompt'
import {Navigation, NavBt, NavBts} from '../Navigation'
import {canSkipReportEditPrompt} from '../../functions/can-skip-report-edit-prompt'
import ReportAsideHeader from './AsideHeader'
import compact from 'lodash/compact'
import join from 'lodash/join'
import {Modules} from './ModulesIndex'
import Icon from './Icon'

const createModule = () => window.event$.emit('report.onNewModuleClick')

class ReportAsideMenu extends React.Component {
  static displayName = 'Report-Aside-Menu'

  static propTypes = {
    canEditReport: PropTypes.bool.isRequired,
    canBrowseReports: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    report: PropTypes.shape({
      id: PropTypes.string,
      modules: PropTypes.array
    })
  }

  static contextTypes = {
    messages: PropTypes.object,
    locales: PropTypes.string,
    router: PropTypes.object,
    location: PropTypes.object,
    params: PropTypes.shape({
      company: PropTypes.string.isRequired,
      workspace: PropTypes.string,
      folder: PropTypes.string
    }).isRequired
  }

  getScopeUrl () {
    const {company, workspace, folder} = this.context.params

    return '/' +
      join(compact([
        `c/${company}`,
        workspace && `w/${workspace}`,
        folder && `f/${folder}`
      ]), '/')
  }

  onClickDelete () {
    const {params, router} = this.context
    const {dispatch, report} = this.props

    dispatch(deleteReportAction, params, report.id)
      .then(() => {
        router.push(`${this.getScopeUrl()}/reports`)
      })
  }

  render () {
    const {messages, locales, location: {pathname, search}, params} = this.context
    const {report, user, dispatch, canBrowseReports} = this.props
    let {canEditReport} = this.props

    const inEditMode = endsWith(pathname, '/edit')
    const cloneName = new TextMessage(messages.copyOfName, locales).format({name: report.name})
    const shouldSkipEditPrompt = report.is_private || canSkipReportEditPrompt()
    const scopeUrl = this.getScopeUrl()
    const cloneUrl = `${scopeUrl}/reports/new?clone=${report.id}&name=${cloneName}`
    const reportUrl = `${scopeUrl}/r/${report.id}`
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
        <ReportAsideHeader {...{dispatch, params, report, inEditMode}}/>
        <NavBts>
          <NavBt icon='list'>
            <Message>moduleIndexLabel</Message>
            <Modules {...report}/>
          </NavBt>

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
            <NavBt tag={DeleteButton} entityName={report.name} onClick={this.onClickDelete} icon='delete'>
              <Message>deleteReport</Message>
            </NavBt>)}

          <NavBt tag={Link} to={backUrl} icon='close'>
            <Message>oneLevelUpNavigation</Message>
          </NavBt>
        </NavBts>
      </Navigation>
    )
  }
}

const ReportAside = props =>
  <Fence canEditReport canBrowseReports>{({canEditReport, canBrowseReports}) =>
    <ReportAsideMenu
      {...props}
      canEditReport={canEditReport}
      canBrowseReports={canBrowseReports}/>}
  </Fence>

ReportAside.displayName = 'Report-Aside'

export default many([
  {user: ['user']},
  [inferLevelFromProps, 'report']
], ReportAside)
