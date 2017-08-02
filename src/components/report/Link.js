import React from 'react'
import PropTypes from 'prop-types'
import {loadReportsAction} from '../../actions/load-reports'
import get from 'lodash/get'

class ReportLink extends React.Component {
  static displayName = 'Report-Link'

  static propTypes = {
    tag: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]).isRequired,
    params: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    reports: PropTypes.array,
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount () {
    this.loadReports()
  }

  loadReports = () => {
    const {reports, dispatch, params} = this.props

    return reports
      ? Promise.resolve()
      : dispatch(loadReportsAction, params, true)
        .then(() => this.forceUpdate())
  }

  getReportUrl = () => {
    const {params, reports} = this.props
    const {company, workspace, folder} = params

    let baseUrl = `/company/${company}`

    if (workspace) {
      baseUrl += `/workspace/${workspace}`
    }

    if (folder) {
      baseUrl += `/folder/${folder}`
    }

    const mainReportId = get(reports, [0, 'id'])

    if (!mainReportId) {
      // @todo check permissions
      return `${baseUrl}/reports`
    }

    return `${baseUrl}/report/${mainReportId}`
  }

  render () {
    const {children, tag: Tag} = this.props
    const url = this.getReportUrl()

    return (
      <Tag icon='insert_chart' to={url}>
        {children}
      </Tag>
    )
  }
}

export default ReportLink
