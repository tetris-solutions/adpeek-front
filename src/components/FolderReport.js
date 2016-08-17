import React from 'react'
import Report from './Report'
import {contextualize} from './higher-order/contextualize'
import map from 'lodash/map'
import assign from 'lodash/assign'
import {loadReportMetaDataAction} from '../actions/load-report-meta-data'
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
    this.props.dispatch(
      loadReportMetaDataAction,
      this.props.params,
      this.props.folder.account.platform,
      'Campaign'
    )
  },
  getEntities () {
    const {messages} = this.context
    const {account: {platform}, campaigns, adSets, adGroups, ads} = this.props.folder
    const useExternalId = c => assign({}, c, {id: c.external_id})

    return [
      {
        id: 'Campaign',
        name: messages.campaigns,
        list: map(campaigns, useExternalId)
      },
      platform === 'adwords' ? {
        id: 'AdGroup',
        name: messages.adGroups,
        list: map(adGroups, useExternalId)
      } : {
        id: 'AdSet',
        name: messages.adSets,
        list: map(adSets, useExternalId)
      },
      {
        id: 'Ad',
        name: messages.ads,
        list: map(ads, useExternalId)
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
