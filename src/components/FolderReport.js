import React from 'react'
import ReportContainer from './Report/Container'
import {contextualize} from './higher-order/contextualize'
import get from 'lodash/get'
import endsWith from 'lodash/endsWith'

const FolderReport = React.createClass({
  displayName: 'Folder-Report',
  propTypes: {
    report: React.PropTypes.object,
    location: React.PropTypes.object,
    metaData: React.PropTypes.object,
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
  render () {
    const {metaData, folder, location} = this.props
    const {account} = folder

    return (
      <ReportContainer
        {...this.props}
        editMode={endsWith(location.pathname, '/edit')}
        metaData={get(metaData, account.platform)}
        {...folder.entities}
        accounts={[account]}/>
    )
  }
})

export default contextualize(FolderReport, {metaData: ['reportMetaData']}, 'folder', 'report')
