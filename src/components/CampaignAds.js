import React from 'react'
import map from 'lodash/map'

const {PropTypes} = React

const CampaignAds = ({campaign}) => (
  <ul>
    {map(campaign.ads,
      ({name, id}) =>
        <li key={id}>{name}</li>)}
  </ul>
)

CampaignAds.displayName = 'Campaign-Ads'
CampaignAds.propTypes = {
  campaign: PropTypes.shape({
    ads: PropTypes.array
  })
}

export default CampaignAds
