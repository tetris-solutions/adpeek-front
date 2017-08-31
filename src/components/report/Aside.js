import endsWith from 'lodash/endsWith'
import Message from 'tetris-iso/Message'
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
import {withState} from 'recompose'

const indexModeToggle = withState('indexMode', 'setIndexMode', false)
const createModule = () => window.event$.emit('report.onNewModuleClick')

export function ReportAside ({report, user, dispatch, indexMode, setIndexMode}, {messages, locales, router, location: {pathname, search}, params}) {
  const {company, workspace, folder} = params

  const scopeUrl = '/' +
    join(compact([
      `c/${company}`,
      workspace && `w/${workspace}`,
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
        <ReportAsideHeader {...{dispatch, params, report, inEditMode}}/>

        {indexMode
          ? <Modules {...report} exit={() => setIndexMode(false)}/>
          : (
            <NavBts>
              <NavBt icon='list' onClick={() => setIndexMode(true)}>
                <Message>moduleIndexLabel</Message>
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
                <NavBt tag={DeleteButton} entityName={report.name} onClick={deleteReport} icon='delete'>
                  <Message>deleteReport</Message>
                </NavBt>)}

              <NavBt tag={Link} to={backUrl} icon='close'>
                <Message>oneLevelUpNavigation</Message>
              </NavBt>
            </NavBts>)}
      </Navigation>
    )
  }

  return <Fence canEditReport canBrowseReports>{navigation}</Fence>
}

ReportAside.displayName = 'Report-Aside'
ReportAside.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.object,
  report: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  indexMode: PropTypes.bool,
  setIndexMode: PropTypes.func
}
ReportAside.contextTypes = {
  messages: PropTypes.object,
  locales: PropTypes.string,
  router: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object
}

export default many([
  {user: ['user']},
  [inferLevelFromProps, 'report']
], indexModeToggle(ReportAside))
