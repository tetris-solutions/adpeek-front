import React from 'react'
import Creatives from './Creatives'

const CampaignCreatives = ({campaign, dispatch, params}) => (
  <Creatives
    dispatch={dispatch}
    params={params}
    adGroups={campaign.adGroups}
    platform={campaign.platform}/>
)

CampaignCreatives.displayName = 'Campaign-Creatives'
CampaignCreatives.propTypes = {
  campaign: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object
}

export default CampaignCreatives
