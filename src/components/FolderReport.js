import assign from 'lodash/assign'
import endsWith from 'lodash/endsWith'
import flatten from 'lodash/flatten'
import map from 'lodash/map'
import trim from 'lodash/trim'
import React from 'react'
import has from 'lodash/has'
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
    metaData: PropTypes.object,
    dispatch: PropTypes.func,
    folder: PropTypes.shape({
      campaigns: PropTypes.array,
      adSets: PropTypes.array,
      keywords: PropTypes.array,
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
    const {params, folder, dispatch, metaData} = this.props
    const {platform} = folder.account

    const loadEntitiesPromise = folder.ads
      ? Promise.resolve()
      : dispatch(loadFolderEntitiesAction, params.company, params.workspace, params.folder)

    const loadMetaDataPromise = map(this.getEntities(),
      ({id}) => has(metaData, [platform, id])
        ? Promise.resolve()
        : dispatch(loadReportMetaDataAction, platform, id))

    Promise.all(flatten([loadEntitiesPromise, loadMetaDataPromise]))
      .then(() => this.setState({isLoading: false}))
  },
  getEntities () {
    const {messages} = this.context
    const {account: {platform}, campaigns, adSets, adGroups, ads, keywords} = this.props.folder

    const entities = [{
      id: 'Campaign',
      name: messages.campaigns,
      list: map(campaigns, c => assign({}, c, {id: c.external_id}))
    }]

    if (platform === 'adwords') {
      entities.push({
        id: 'AdGroup',
        name: messages.adGroups,
        list: adGroups || []
      })
      entities.push({
        id: 'Keyword',
        name: messages.keywords,
        list: keywords || []
      })
    }

    if (platform === 'facebook') {
      entities.push({
        id: 'AdSet',
        name: messages.adSets,
        list: adSets || []
      })
    }

    entities.push({
      id: 'Ad',
      name: messages.ads,
      list: map(ads, normalizeAd)
    })

    return entities
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

export default contextualize(FolderReport, {metaData: ['reportMetaData']}, 'folder')
