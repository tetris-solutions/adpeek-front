import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Reports from './Report/List'

export const WorkspaceReports = React.createClass({
  displayName: 'Workspace-Reports',
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    workspace: React.PropTypes.shape({
      id: React.PropTypes.string,
      reports: React.PropTypes.array
    })
  },
  render () {
    const {params, dispatch, workspace: {id, reports}} = this.props
    const path = `/company/${params.company}/workspace/${id}`

    return <Reports params={params} dispatch={dispatch} path={path} reports={reports}/>
  }
})

export default contextualize(WorkspaceReports, 'workspace')
