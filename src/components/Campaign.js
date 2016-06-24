import React from 'react'
import CampaignAdGroups from './CampaignAdGroups'
import {contextualize} from './higher-order/contextualize'
import Message from '@tetris/front-server/lib/components/intl/Message'

const {PropTypes} = React

export const Campaign = React.createClass({
  displayName: 'Campaign',
  propTypes: {
    dispatch: PropTypes.func,
    campaign: PropTypes.shape({
      platform: PropTypes.string,
      ads: PropTypes.array
    }),
    params: PropTypes.object
  },
  render () {
    const {params, dispatch, campaign} = this.props

    return (
      <div>
        <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
            <Message campaign={campaign.name}>campaignAdsTitle</Message>
          </div>
        </header>

        {campaign.platform === 'adwords' && (
          <CampaignAdGroups
            campaign={campaign}
            dispatch={dispatch}
            params={params}/>
        )}
      </div>
    )
  }
})

export default contextualize(Campaign, 'campaign')
