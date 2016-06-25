import React from 'react'
import ContextMenu from './ContextMenu'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export const CampaignAside = ({campaign}) =>
  <ContextMenu title={campaign.name} icon='format_shapes'/>

CampaignAside.displayName = 'Campaign-Aside'
CampaignAside.propTypes = {
  campaign: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}

export default contextualize(CampaignAside, 'campaign')
