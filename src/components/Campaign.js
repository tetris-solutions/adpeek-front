import React from 'react'
import AdGroups from './AdGroups'
import {contextualize} from './higher-order/contextualize'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {loadCampaignAdGroupsAction} from '../actions/load-campaign-adgroups'
import NotImplemented from './AdGroupsNotImplemented'
import LoadingHorizontal from './LoadingHorizontal'
import {extractCampaignAdGroupsAction} from '../actions/extract-campaign-adgroups'

const {PropTypes} = React

export const Campaign = React.createClass({
  displayName: 'Campaign',
  propTypes: {
    dispatch: PropTypes.func,
    campaign: PropTypes.shape({
      adGroupsReport: PropTypes.shape({
        url: PropTypes.string
      }),
      platform: PropTypes.string,
      adGroups: PropTypes.array
    }),
    params: PropTypes.object
  },
  getInitialState () {
    return {
      creatingReport: false,
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
  onReportCreated () {
    this.setState({creatingReport: false})

    window.location.href = this.props.campaign.adGroupsReport.url
  },
  extractReport () {
    const {campaign, dispatch, params} = this.props

    this.setState({creatingReport: true})

    dispatch(extractCampaignAdGroupsAction,
      params.company,
      params.workspace,
      params.folder,
      campaign.id)
      .then(this.onReportCreated)
  },
  render () {
    const {creatingReport, isLoading} = this.state
    const {campaign} = this.props
    const inner = campaign.platform === 'adwords'
      ? <AdGroups adGroups={campaign.adGroups || []}/>
      : <NotImplemented />

    return (
      <div>
        <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
            <Message campaign={campaign.name}>campaignAdsTitle</Message>
            <div className='mdl-layout-spacer'/>

            <button
              disabled={creatingReport}
              onClick={this.extractReport}
              className='mdl-button mdl-color-text--grey-100'>

              {creatingReport
                ? <Message>creatingReport</Message>
                : <Message>extractReport</Message>}
            </button>
          </div>
        </header>

        {isLoading ? (
          <LoadingHorizontal>
            <Message>loadingAds</Message>
          </LoadingHorizontal>
        ) : inner}
      </div>
    )
  }
})

export default contextualize(Campaign, 'campaign')
