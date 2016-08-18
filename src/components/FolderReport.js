import React from 'react'
import Report from './Report'
import {contextualize} from './higher-order/contextualize'
import map from 'lodash/map'
import assign from 'lodash/assign'
import {loadReportMetaDataAction} from '../actions/load-report-meta-data'
import {loadFolderEntitiesAction} from '../actions/load-folder-entities'
import endsWith from 'lodash/endsWith'

const {PropTypes} = React

const FolderReport = React.createClass({
  displayName: 'Folder-Report',
  contextTypes: {
    messages: PropTypes.object
  },
  propTypes: {
    location: PropTypes.object,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    folder: PropTypes.shape({
      campaigns: PropTypes.array,
      adSets: PropTypes.array,
      adGroups: PropTypes.array,
      ads: PropTypes.array,
      account: PropTypes.shape({
        external_id: PropTypes.string,
        tetris_id: PropTypes.string,
        platform: PropTypes.string
      })
    })
  },
  componentDidMount () {
    const {params, folder, dispatch} = this.props

    dispatch(loadFolderEntitiesAction,
      params.company,
      params.workspace,
      params.folder)

    map(this.getEntities(), ({id}) =>
      dispatch(loadReportMetaDataAction,
        params,
        folder.account.platform,
        id
      ))
  },
  getEntities () {
    const {messages} = this.context
    const {account: {platform}, campaigns, adSets, adGroups, ads} = this.props.folder

    return [
      {
        id: 'Campaign',
        name: messages.campaigns,
        list: map(campaigns, c => assign({}, c, {id: c.external_id}))
      },
      platform === 'adwords' ? {
        id: 'AdGroup',
        name: messages.adGroups,
        list: adGroups || []
      } : {
        id: 'AdSet',
        name: messages.adSets,
        list: adSets || []
      },
      {
        id: 'Ad',
        name: messages.ads,
        list: ads || []
      }
    ]
  },
  render () {
    const {folder, location} = this.props
    const reportParams = {
      ad_account: folder.account.external_id,
      platform: folder.account.platform,
      tetris_account: folder.account.tetris_id
    }

    return (
      <Report
        {...this.props}
        editMode={endsWith(location.pathname, '/edit')}
        reportParams={reportParams}
        entities={this.getEntities()}/>
    )
  }
})

export default contextualize(FolderReport, 'folder')
