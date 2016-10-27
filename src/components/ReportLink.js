import React from 'react'
import Fence from './Fence'
import {Link} from 'react-router'
import {Button} from './Navigation'
import Message from 'tetris-iso/Message'
import {loadReportsAction} from '../actions/load-reports'
import get from 'lodash/get'

const {PropTypes} = React

const ReportLink = React.createClass({
  displayName: 'Report-Link',
  propTypes: {
    params: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  },
  getInitialState () {
    return {isLoading: true}
  },
  componentDidMount () {
    const {node, dispatch, params} = this.props

    if (node.reports) return this.setState({isLoading: false})

    dispatch(loadReportsAction, params, true)
      .then(() => this.setState({isLoading: false}))
  },
  render () {
    if (this.state.isLoading) return null

    const {node, params: {company, workspace, folder}} = this.props

    let level = 'company'
    let baseUrl = `/company/${company}`

    if (workspace) {
      level = 'workspace'
      baseUrl += `/workspace/${workspace}`
    }

    if (folder) {
      level = 'folder'
      baseUrl += `/folder/${folder}`
    }

    const mainReportId = get(node, ['reports', 0, 'id'])
    const reportUrl = `${baseUrl}/${mainReportId ? `report/${mainReportId}` : 'reports'}`

    return (
      <Fence canBrowseReports>{({canBrowseReports}) => canBrowseReports || mainReportId ? (
        <Button tag={Link} to={reportUrl} icon='show_chart'>
          <Message>{`${level}Report`}</Message>
        </Button>) : null}
      </Fence>
    )
  }
})

export default ReportLink
