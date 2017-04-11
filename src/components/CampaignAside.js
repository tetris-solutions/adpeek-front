import React from 'react'
import PropTypes from 'prop-types'
import {node} from './higher-order/branch'
import {Link} from 'react-router'
import Message from 'tetris-iso/Message'
import {Navigation, NavBt, NavBts, Name} from './Navigation'

export const CampaignAside = ({params: {company, workspace, folder}, campaign}) =>
  <Navigation icon='format_shapes'>
    <Name>
      {campaign.name}
    </Name>
    <NavBts>
      <NavBt tag={Link} to={`/company/${company}/workspace/${workspace}/folder/${folder}`} icon='close'>
        <Message>oneLevelUpNavigation</Message>
      </NavBt>
    </NavBts>
  </Navigation>

CampaignAside.displayName = 'Campaign-Aside'
CampaignAside.propTypes = {
  params: PropTypes.object,
  campaign: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}

export default node('folder', 'campaign', CampaignAside)
