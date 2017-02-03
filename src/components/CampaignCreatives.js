import React from 'react'
import Creatives from './Creatives'

const CampaignCreatives = ({folder, campaign, dispatch, params, cursors}) => (
  <Creatives
    dispatch={dispatch}
    params={params}
    kpi={folder.kpi_name}
    getAdGroupsWithRelevance={() => cursors.campaign.adGroups}
    adGroups={campaign.adGroups}
    platform={campaign.platform}/>
)

CampaignCreatives.displayName = 'Campaign-Creatives'
CampaignCreatives.propTypes = {
  cursors: React.PropTypes.object,
  folder: React.PropTypes.object,
  campaign: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object
}

export default CampaignCreatives
