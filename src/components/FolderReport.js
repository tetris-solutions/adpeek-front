import assign from 'lodash/assign'
import endsWith from 'lodash/endsWith'
import flatten from 'lodash/flatten'
import map from 'lodash/map'
import trim from 'lodash/trim'
import React from 'react'

import Report from './Report'
import {loadFolderEntitiesAction} from '../actions/load-folder-entities'
import {loadReportMetaDataAction} from '../actions/load-report-meta-data'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

function normalizeAd (ad) {
  ad = assign({}, ad)

  if (ad.description_1) {
    ad.description = (
      trim(ad.description_1) + ' ' +
      trim(ad.description_2)
    )
  }

  if (ad.headline_part_1) {
    ad.headline = (
      trim(ad.headline_part_1) + ' ' +
      trim(ad.headline_part_2)
    )
  }

  return ad
}

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
  getInitialState () {
    return {
      isLoading: true
    }
  },
  componentDidMount () {
    const {params, folder, dispatch} = this.props

    const loadEntitiesPromise = dispatch(loadFolderEntitiesAction,
      params.company,
      params.workspace,
      params.folder)

    const loadMetaDataPromise = map(this.getEntities(), ({id}) =>
      dispatch(loadReportMetaDataAction,
        params,
        folder.account.platform,
        id
      ))

    Promise.all(flatten([loadEntitiesPromise, loadMetaDataPromise]))
      .then(() => this.setState({isLoading: false}))
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
        list: map(ads, normalizeAd)
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
        isLoading={this.state.isLoading}
        editMode={endsWith(location.pathname, '/edit')}
        reportParams={reportParams}
        entities={this.getEntities()}/>
    )
  }
})

export default contextualize(FolderReport, 'folder')
