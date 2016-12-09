import React from 'react'
import ReportContainer from './Report/Container'
import {contextualize} from './higher-order/contextualize'
import get from 'lodash/get'
import endsWith from 'lodash/endsWith'

const {PropTypes} = React

const FolderReport = React.createClass({
  displayName: 'Folder-Report',
  propTypes: {
    report: PropTypes.object,
    location: PropTypes.object,
    metaData: PropTypes.object,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    folder: PropTypes.shape({
      account: PropTypes.shape({
        external_id: PropTypes.string,
        tetris_id: PropTypes.string,
        platform: PropTypes.string
      }),
      entities: PropTypes.shape({
        campaigns: PropTypes.array,
        adSets: PropTypes.array,
        keywords: PropTypes.array,
        adGroups: PropTypes.array,
        ads: PropTypes.array
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
