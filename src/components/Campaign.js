import React from 'react'
import CampaignAdGroup from './CampaignAdGroup'
import {contextualize} from './higher-order/contextualize'
import {loadCampaignAdGroupsAction} from '../actions/load-adgroups'
import {loadCampaignAdGroupAdsAction} from '../actions/load-adgroup-ads'
import map from 'lodash/map'

const {PropTypes} = React

export const Campaign = React.createClass({
  displayName: 'Campaign',
  propTypes: {
    dispatch: PropTypes.func,
    campaign: PropTypes.shape({
      platform: PropTypes.string,
      ads: PropTypes.array
    }),
    params: PropTypes.object
  },
  componentDidMount () {
    if (this.props.campaign.platform === 'adwords') {
      this.loadAdGroups()
    }
  },
  loadAdGroups () {
    const {dispatch, params} = this.props

    dispatch(loadCampaignAdGroupsAction,
      params.company,
      params.workspace,
      params.folder,
      params.campaign)
  },
  loadAdGroupAds (adGroup) {
    if (!this.loadAdsPromise) {
      this.loadAdsPromise = Promise.resolve()
    }

    this.loadAdsPromise = this.loadAdsPromise.then(() => {
      const {dispatch, params} = this.props

      return dispatch(loadCampaignAdGroupAdsAction,
        params.company,
        params.workspace,
        params.folder,
        params.campaign,
        adGroup)
    })
  },
  render () {
    const {campaign} = this.props

    return (
      <div>
        <h1>{campaign.name}</h1>

        {map(campaign.adGroups,
          adGroup => (
            <CampaignAdGroup
              key={adGroup.id}
              loadAdGroupAds={this.loadAdGroupAds}
              adGroup={adGroup}/>
          ))}
      </div>
    )
  }
})

export default contextualize(Campaign, 'campaign')
