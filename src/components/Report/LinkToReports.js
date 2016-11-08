import React from 'react'
import Fence from '../Fence'
import {Link} from 'react-router'
import {Button} from '../Navigation'
import {loadReportsAction} from '../../actions/load-reports'
import get from 'lodash/get'

const {PropTypes} = React

const ReportLink = React.createClass({
  displayName: 'Report-Link',
  propTypes: {
    params: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    reports: PropTypes.array,
    dispatch: PropTypes.func.isRequired
  },
  getInitialState () {
    return {isLoading: true}
  },
  componentDidMount () {
    const {reports, dispatch, params} = this.props

    if (reports) return this.setState({isLoading: false})

    dispatch(loadReportsAction, params, true)
      .then(() => this.setState({isLoading: false}))
  },
  render () {
    if (this.state.isLoading) return null

    const {reports, children, params: {company, workspace, folder}} = this.props

    let baseUrl = `/company/${company}`

    if (workspace) {
      baseUrl += `/workspace/${workspace}`
    }

    if (folder) {
      baseUrl += `/folder/${folder}`
    }

    const mainReportId = get(reports, [0, 'id'])
    const reportUrl = `${baseUrl}/${mainReportId ? `report/${mainReportId}` : 'reports'}`

    return (
      <Fence canBrowseReports>{({canBrowseReports}) => canBrowseReports || mainReportId ? (
        <Button tag={Link} to={reportUrl} icon='show_chart'>
          {children}
        </Button>) : null}
      </Fence>
    )
  }
})

export default ReportLink
