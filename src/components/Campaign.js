import React from 'react'
import Ads from './CampaignAds'
import {contextualize} from './higher-order/contextualize'
import {loadCampaignAdsAction} from '../actions/load-ads'

const {PropTypes} = React

export const Campaign = React.createClass({
  displayName: 'Campaign',
  propTypes: {
    dispatch: PropTypes.func,
    campaign: PropTypes.shape({
      ads: PropTypes.array
    }),
    params: PropTypes.object
  },
  componentDidMount () {
    const {dispatch, params} = this.props

    dispatch(loadCampaignAdsAction,
      params.company,
      params.workspace,
      params.folder,
      params.campaign)
  },
  render () {
    const {campaign} = this.props

    return (
      <div>
        <h1>{campaign.name}</h1>
        <Ads campaign={campaign}/>
      </div>
    )
  }
})

export default contextualize(Campaign, 'campaign')
