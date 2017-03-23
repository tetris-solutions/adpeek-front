import React from 'react'
import UI from '../UI'
import ReportContainer from './Container'
import {many} from '../higher-order/branch'
import {inferLevelFromParams} from '../../functions/infer-level-from-params'
import compact from 'lodash/compact'
import get from 'lodash/get'

function Wrapper (props) {
  const {accounts, metaData, location, report, dispatch, params, level} = props
  const node = props[level]

  return (
    <ReportContainer
      {...node.entities}
      dispatch={dispatch}
      location={location}
      accounts={accounts}
      report={report}
      params={params}
      metaData={get(metaData, report.platform || '_')}
      reportLiteMode/>
  )
}

Wrapper.displayName = 'Report-Wrapper'
Wrapper.propTypes = {
  metaData: React.PropTypes.object,
  report: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  accounts: React.PropTypes.array.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  params: React.PropTypes.object.isRequired,
  level: React.PropTypes.string.isRequired
}

const Share = React.createClass({
  displayName: 'Report-Share',
  propTypes: {
    location: React.PropTypes.object.isRequired
  },
  contextTypes: {
    tree: React.PropTypes.object.isRequired
  },
  childContextTypes: {
    params: React.PropTypes.object,
    company: React.PropTypes.object
  },
  componentWillMount () {
    const {params} = this.getReportShare()
    const level = this.level = inferLevelFromParams(params)

    this.ReportWrapper = many(compact([
      {metaData: ['reportMetaData']},
      ['user', 'company'],
      params.workspace && ['company', 'workspace'],
      params.folder && ['workspace', 'folder'],
      [level, 'report']
    ]), Wrapper)
  },
  getChildContext () {
    const {params, company} = this.getReportShare()

    return {company, params}
  },
  getReportShare () {
    return this.context.tree.get('reportShare')
  },
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
})

export default Share
