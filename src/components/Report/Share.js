import React from 'react'
import PropTypes from 'prop-types'
import UI from '../UI'
import ReportContainer from './Container'
import {many, branch} from '../higher-order/branch'
import {inferLevelFromParams} from '../../functions/infer-level-from-params'
import compact from 'lodash/compact'
import get from 'lodash/get'

function Wrapper (props) {
  const {accounts, reportMetaData, location, report, dispatch, params, level} = props
  const node = props[level]

  return (
    <ReportContainer
      {...node.entities}
      dispatch={dispatch}
      location={location}
      accounts={accounts}
      report={report}
      params={params}
      metaData={get(reportMetaData, report.platform || '_')}
      reportLiteMode/>
  )
}

Wrapper.displayName = 'Report-Wrapper'
Wrapper.propTypes = {
  reportMetaData: PropTypes.object,
  report: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  level: PropTypes.string.isRequired
}

class Share extends React.Component {
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

    this.ReportWrapper = many(compact([
      ['user', 'company'],
      params.workspace && ['company', 'workspace'],
      params.folder && ['workspace', 'folder'],
      [level, 'report']
    ]), branch('reportMetaData', Wrapper, 2))
  }

  getChildContext () {
    const {params, company} = this.getReportShare()

    return {company, params}
  }

  getReportShare = () => {
    return this.context.tree.get('reportShare')
  }

  render () {
    const Report = this.ReportWrapper
    const {level, accounts} = this.getReportShare()

    return (
      <UI>
        <Report
          level={level}
          location={this.props.location}
          accounts={accounts}/>
      </UI>
    )
  }
}

export default Share
