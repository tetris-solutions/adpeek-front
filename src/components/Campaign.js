import React from 'react'
import AdGroups from './AdGroups'
import {contextualize} from './higher-order/contextualize'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {loadCampaignAdGroupsAction} from '../actions/load-campaign-adgroups'
import NotImplemented from './AdGroupsNotImplemented'
import LoadingHorizontal from './LoadingHorizontal'

const {PropTypes} = React

export const Campaign = React.createClass({
  displayName: 'Campaign',
  propTypes: {
    dispatch: PropTypes.func,
    campaign: PropTypes.shape({
      platform: PropTypes.string,
      adGroups: PropTypes.array
    }),
    params: PropTypes.object
  },
  getInitialState () {
    return {
      isLoading: this.props.campaign.platform === 'adwords'
    }
  },
  componentDidMount () {
    const {campaign, dispatch, params} = this.props

    if (campaign.platform === 'adwords') {
      dispatch(loadCampaignAdGroupsAction,
        params.company,
        params.workspace,
        params.folder,
        campaign.id)
        .then(() => this.setState({isLoading: false}))
    }
  },
  render () {
    const {campaign} = this.props
    const inner = campaign.platform === 'adwords'
      ? <AdGroups adGroups={campaign.adGroups || []}/>
      : <NotImplemented />

    return (
      <div>
        <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
            <Message campaign={campaign.name}>campaignAdsTitle</Message>
          </div>
        </header>

        {this.state.isLoading ? (
          <LoadingHorizontal>
            <Message>loadingAds</Message>
          </LoadingHorizontal>
        ) : inner}
      </div>
    )
  }
})

export default contextualize(Campaign, 'campaign')
