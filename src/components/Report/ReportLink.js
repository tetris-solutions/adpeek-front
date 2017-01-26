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
    return {
      isLoading: false,
      hasFired: false
    }
  },
  componentDidUpdate () {
    if (!this.gone && this.state.hasFired && this.props.reports) {
      this.gone = true
      this.context.router.push(this.getUrl())
    }
  },
  loadReports () {
    const {reports, dispatch, params} = this.props

    if (reports) return Promise.resolve()

    this.setState({isLoading: true})

    return dispatch(loadReportsAction, params, true)
      .then(() => this.setState({hasFired: true}))
  },
  onClick () {
    if (this.state.isLoading) return

    this.loadReports()
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
      // @todo check permissions
      return `${baseUrl}/reports`
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
