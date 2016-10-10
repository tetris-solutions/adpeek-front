import React from 'react'
import ContextMenu from './ContextMenu'
import {contextualize} from './higher-order/contextualize'
import {Link} from 'react-router'
import Message from 'tetris-iso/Message'

const {PropTypes} = React

export const CampaignAside = ({params: {company, workspace, folder}, campaign}) =>
  <ContextMenu title={campaign.name} icon='format_shapes'>
    <Link className='mdl-navigation__link' to={`/company/${company}/workspace/${workspace}/folder/${folder}`}>
      <i className='material-icons'>close</i>
      <Message>oneLevelUpNavigation</Message>
    </Link>
  </ContextMenu>

CampaignAside.displayName = 'Campaign-Aside'
CampaignAside.propTypes = {
  params: PropTypes.object,
  campaign: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}

export default contextualize(CampaignAside, 'campaign')
