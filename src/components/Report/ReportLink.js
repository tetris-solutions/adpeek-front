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

  state = {
    isLoading: false,
    isReady: false
  }

  componentDidUpdate () {
    if (!this.gone && this.state.isReady && this.props.reports) {
      this.gone = true
      this.context.router.push(this.getUrl())
    }
  }

  loadReports = () => {
    const {reports, dispatch, params} = this.props
    const onReady = () => this.setState({isReady: true})

    if (reports) {
      return Promise.resolve().then(onReady)
    }

    this.setState({isLoading: true})

    return dispatch(loadReportsAction, params, true)
      .then(onReady)
  }

  onClick = () => {
    if (this.state.isLoading) return

    this.loadReports()
  }

  getUrl = () => {
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

    return (
      <Tag icon='show_chart' onClick={this.onClick}>
        {children}
      </Tag>
    )
  }
}

export default ReportLink
