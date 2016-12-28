import React from 'react'
import {loadReportsAction} from '../../actions/load-reports'
import get from 'lodash/get'

const ReportLink = React.createClass({
  displayName: 'Report-Link',
  propTypes: {
    tag: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func
    ]).isRequired,
    params: React.PropTypes.object.isRequired,
    children: React.PropTypes.node.isRequired,
    reports: React.PropTypes.array,
    dispatch: React.PropTypes.func.isRequired
  },
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState () {
    return {isLoading: false}
  },
  loadReports () {
    const {reports, dispatch, params} = this.props

    if (reports) return Promise.resolve()

    this.setState({isLoading: true})

    return dispatch(loadReportsAction, params, true)
      .then(() => this.setState({isLoading: false}))
  },
  onClick () {
    if (this.state.isLoading) return

    this.loadReports()
      .then(() => {
        this.context.router.push(this.getUrl())
      })
  },
  getUrl () {
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
      throw new Error('Could not find report', 404)
    }

    return `${baseUrl}/report/${mainReportId}`
  },
  render () {
    const {children, tag: Tag} = this.props

    return (
      <Tag icon='show_chart' onClick={this.onClick}>
        {children}
      </Tag>
    )
  }
})

export default ReportLink
