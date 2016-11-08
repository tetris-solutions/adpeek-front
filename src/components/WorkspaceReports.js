import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Reports from './Report/List'

const {PropTypes} = React

export const WorkspaceReports = React.createClass({
  displayName: 'Workspace-Reports',
  propTypes: {
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string
    }),
    workspace: PropTypes.shape({
      id: PropTypes.string,
      reports: PropTypes.array
    })
  },
  render () {
    const {workspace: {id, reports}, params: {company}} = this.props
    const path = `/company/${company}/workspace/${id}`

    return <Reports path={path} reports={reports}/>
  }
})

export default contextualize(WorkspaceReports, 'workspace')
