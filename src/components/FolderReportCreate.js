import React from 'react'
import {contextualize} from './higher-order/contextualize'
import ReportCreate from './ReportCreate'

const {PropTypes} = React

const FolderReportCreate = React.createClass({
  displayName: 'Folder-Report-Create',
  propTypes: {
    location: PropTypes.shape({
      query: PropTypes.object
    }).isRequired,
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string,
      folder: PropTypes.string
    }).isRequired,
    folder: PropTypes.shape({
      id: PropTypes.string,
      account: PropTypes.shape({
        platform: PropTypes.string
      })
    }),
    dispatch: PropTypes.func.isRequired
  },
  render () {
    const {location, params, dispatch, folder} = this.props

    return (
      <ReportCreate
        platform={folder.account.platform}
        location={location}
        params={params}
        dispatch={dispatch}/>
    )
  }
})

export default contextualize(FolderReportCreate, 'folder')
