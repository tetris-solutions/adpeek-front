import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Reports from './Report/List'

// @todo abstract boilerplate into a HOC

export const FolderReports = React.createClass({
  displayName: 'Folder-Reports',
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    folder: React.PropTypes.object
  },
  render () {
    const {params, dispatch, folder: {id, reports}} = this.props
    const path = `/company/${params.company}/workspace/${params.workspace}/folder/${id}`

    return <Reports params={params} dispatch={dispatch} path={path} reports={reports}/>
  }
})

export default contextualize(FolderReports, 'folder')
