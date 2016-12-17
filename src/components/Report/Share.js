import React from 'react'
import UI from '../UI'
import ReportContainer from './Container'
import {contextualize} from '../higher-order/contextualize'
import {inferLevelFromParams} from '../../functions/infer-level-from-params'

import get from 'lodash/get'

const {PropTypes} = React

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
  metaData: PropTypes.object,
  report: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  level: PropTypes.string.isRequired
}

const Share = React.createClass({
  displayName: 'Report-Share',
  propTypes: {
    location: PropTypes.object.isRequired
  },
  contextTypes: {
    tree: PropTypes.object.isRequired
  },
  childContextTypes: {
    params: PropTypes.object,
    company: PropTypes.object
  },
  componentWillMount () {
    const {params} = this.getReportShare()
    const level = this.level = inferLevelFromParams(params)

    this.ReportWrapper = contextualize(Wrapper, {
      metaData: ['reportMetaData']
    }, level, 'report')
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
