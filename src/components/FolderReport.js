import React from 'react'
import ReportContainer from './Report/Container'
import {node, branch} from './higher-order/branch'
import get from 'lodash/get'
import endsWith from 'lodash/endsWith'

const FolderReport = React.createClass({
  displayName: 'Folder-Report',
  propTypes: {
    report: React.PropTypes.object,
    location: React.PropTypes.object,
    reportMetaData: React.PropTypes.object,
    params: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func,
    folder: React.PropTypes.shape({
      account: React.PropTypes.shape({
        external_id: React.PropTypes.string,
        tetris_id: React.PropTypes.string,
        platform: React.PropTypes.string
      }),
      entities: React.PropTypes.shape({
        campaigns: React.PropTypes.array,
        adSets: React.PropTypes.array,
        keywords: React.PropTypes.array,
        adGroups: React.PropTypes.array,
        ads: React.PropTypes.array
      })
    })
  },
  getAccounts () {
    this._accounts = this._accounts || [this.props.folder.account]

    return this._accounts
  },
  render () {
    const {reportMetaData: metaData, folder, location} = this.props

    return (
      <ReportContainer
        {...this.props}
        editMode={endsWith(location.pathname, '/edit')}
        metaData={get(metaData, folder.account.platform)}
        {...folder.entities}
        accounts={this.getAccounts()}/>
    )
  }
})

export default node('workspace', 'folder', branch('reportMetaData', FolderReport))
