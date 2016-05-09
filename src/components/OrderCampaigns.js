import React from 'react'
import {contextualize} from './higher-order/contextualize'
import CampaignsToggle from './CampaignsToggle'
import Campaign from './Campaign'
import size from 'lodash/size'

import Message from '@tetris/front-server/lib/components/intl/Message'
import map from 'lodash/map'

const {PropTypes} = React

export const OrderCampaigns = React.createClass({
  displayName: 'Order-Campaigns',
  propTypes: {
    addCampaigns: PropTypes.func,
    campaigns: PropTypes.array,
    messages: PropTypes.object
  },
  shouldComponentUpdate ({campaigns}) {
    return size(campaigns) !== size(this.props.campaigns)
  },
  render () {
    const {campaigns, messages} = this.props

    return (
      <CampaignsToggle
        onSelected={this.props.addCampaigns}
        title={<Message n={String(size(campaigns))}>nLooseCampaigns</Message>}
        label={messages.linkCampaignsCallToAction}>

        {map(campaigns, (campaign, index) =>
          <Campaign key={campaign.external_id} {...campaign}/>)}

      </CampaignsToggle>
    )
  }
})

export default contextualize(OrderCampaigns, 'messages')
