import React from 'react'
import {contextualize} from './higher-order/contextualize'
import {Link} from 'react-router'
import Message from 'tetris-iso/Message'
import {Navigation, NavBt, Buttons, Name} from './Navigation'

const {PropTypes} = React

export const CampaignAside = ({params: {company, workspace, folder}, campaign}) =>
  <Navigation icon='format_shapes'>
    <Name>
      {campaign.name}
    </Name>
    <Buttons>
      <NavBt tag={Link} to={`/company/${company}/workspace/${workspace}/folder/${folder}`} icon='close'>
        <Message>oneLevelUpNavigation</Message>
      </NavBt>
    </Buttons>
  </Navigation>

CampaignAside.displayName = 'Campaign-Aside'
CampaignAside.propTypes = {
  params: PropTypes.object,
  campaign: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}

export default contextualize(CampaignAside, 'campaign')
