import React from 'react'
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
    campaigns: PropTypes.array
  },
  contextTypes: {
    messages: PropTypes.object
  },
  shouldComponentUpdate ({campaigns}) {
    return size(campaigns) !== size(this.props.campaigns)
  },
  render () {
    const {messages} = this.context
    const {campaigns} = this.props

    return (
      <CampaignsToggle
        headerColor='grey-600'
        onSelected={this.props.addCampaigns}
        title={<Message n={String(size(campaigns))}>nLooseCampaigns</Message>}
        label={messages.linkCampaignsCallToAction}>

        {map(campaigns, (campaign, index) =>
          <Campaign key={campaign.external_id} {...campaign}/>)}

      </CampaignsToggle>
    )
  }
})

export default OrderCampaigns
