import React from 'react'
import PropTypes from 'prop-types'
import UI from '../UI'
import ReportContainer from './Container'
import {many, branch} from '../higher-order/branch'
import {inferLevelFromParams} from '../../functions/infer-level-from-params'
import compact from 'lodash/compact'
import get from 'lodash/get'
import map from 'lodash/map'
import every from 'lodash/every'
import assign from 'lodash/assign'

function ReportWrapper (props) {
  const {authorized, accounts, reportMetaData, location, report, dispatch, params, level} = props
  const node = props[level]

  return (
    <ReportContainer
      {...node.entities}
      dispatch={dispatch}
      location={location}
      accounts={accounts}
      report={assign({authorized}, report)}
      params={params}
      metaData={get(reportMetaData, report.platform || '_')}
      reportLiteMode/>
  )
}

ReportWrapper.displayName = 'Report-Wrapper'
ReportWrapper.propTypes = {
  reportMetaData: PropTypes.object,
  report: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  level: PropTypes.string.isRequired,
  authorized: PropTypes.bool.isRequired
}

const authPats = [
  'company.authorized',
  'workspace.authorized',
  'folder.authorized'
]

const userHasAccess = shareConfig =>
  every(map(authPats,
    path => get(shareConfig, path) !== false))

class ReportShare extends React.Component {
  static displayName = 'Report-Share'

  static propTypes = {
    location: PropTypes.object.isRequired
  }

  static contextTypes = {
    tree: PropTypes.object.isRequired
  }

  static childContextTypes = {
    params: PropTypes.object,
    company: PropTypes.object
  }

  componentWillMount () {
    const {params} = this.getReportShare()
    const level = inferLevelFromParams(params)

    this.BranchedReportWrapper = many(compact([
      ['user', 'company'],
      params.workspace && ['company', 'workspace'],
      params.folder && ['workspace', 'folder'],
      [level, 'report']
    ]), branch('reportMetaData', ReportWrapper, 2))
  }

  getChildContext () {
    const {params, company} = this.getReportShare()

    return {company, params}
  }

  getReportShare = () => {
    return this.context.tree.get('reportShare')
  }

  render () {
    const ReportBranch = this.BranchedReportWrapper
    const report = this.getReportShare()

    return (
      <UI>
        <ReportBranch
          level={report.level}
          authorized={userHasAccess(report)}
          location={this.props.location}
          accounts={report.accounts}/>
      </UI>
    )
  }
}

export default ReportShare
