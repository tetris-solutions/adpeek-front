import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Reports from './Report/List'

const {PropTypes} = React

export const FolderReports = React.createClass({
  displayName: 'Folder-Reports',
  propTypes: {
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string
    }),
    folder: PropTypes.object
  },
  render () {
    const {folder: {id, reports}, params: {company, workspace}} = this.props
    const path = `/company/${company}/workspace/${workspace}/folder/${id}`

    return <Reports path={path} reports={reports}/>
  }
})

export default contextualize(FolderReports, 'folder')
