import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Reports from './Report/List'

const {PropTypes} = React

export const WorkspaceReports = React.createClass({
  displayName: 'Workspace-Reports',
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    workspace: PropTypes.shape({
      id: PropTypes.string,
      reports: PropTypes.array
    })
  },
  render () {
    const {params, dispatch, workspace: {id, reports}} = this.props
    const path = `/company/${params.company}/workspace/${id}`

    return <Reports params={params} dispatch={dispatch} path={path} reports={reports}/>
  }
})

export default contextualize(WorkspaceReports, 'workspace')
