import React from 'react'
import {breakOnEmptyProp} from '../higher-order/not-nullable'
import PropTypes from 'prop-types'
import AdwordsCampaign from './Adwords'

const CampaignHome = ({campaign, dispatch}) => {
  switch (campaign.platform) {
    case 'adwords':
      return <AdwordsCampaign {...campaign} dispatch={dispatch}/>
    default:
      return null
  }
}

CampaignHome.displayName = 'Campaign-Home'
CampaignHome.propTypes = {
  campaign: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default breakOnEmptyProp(CampaignHome, 'campaign')
