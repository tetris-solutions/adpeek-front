import React from 'react'
import PropTypes from 'prop-types'
import Creatives from './Creatives'

const CampaignCreatives = ({folder, campaign, dispatch, params, cursors}) => (
  <Creatives
    dispatch={dispatch}
    params={params}
    folder={folder}
    getAdGroupsWithRelevance={() => cursors.campaign.adGroups}
    adGroups={campaign.adGroups}
    platform={campaign.platform}/>
)

CampaignCreatives.displayName = 'Campaign-Creatives'
CampaignCreatives.propTypes = {
  cursors: PropTypes.object,
  folder: PropTypes.object,
  campaign: PropTypes.object,
  dispatch: PropTypes.func,
  params: PropTypes.object
}

export default CampaignCreatives
