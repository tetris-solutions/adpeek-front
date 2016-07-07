import React from 'react'
import AdGroups from './AdGroups'
import {contextualize} from './higher-order/contextualize'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {loadCampaignAdGroupsAction} from '../actions/load-campaign-adgroups'
import NotImplemented from './AdGroupsNotImplemented'
import LoadingHorizontal from './LoadingHorizontal'
import {createCampaignAdGroupsReportAction} from '../actions/create-campaign-adgroups-report'
import DownloadReportButton from './DownloadReportButton'

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
      isLoading: this.isAdwords()
    }
  },
  isAdwords () {
    return this.props.campaign.platform === 'adwords'
  },
  componentDidMount () {
    if (this.isAdwords()) {
      this.loadAdGroups()
    }
  },
  onReportCreated () {
    this.setState({creatingReport: false})

    window.location.href = this.props.campaign.adGroupsReport.url
  },
  loadAdGroups () {
    const {dispatch, params} = this.props

    this.loadingAdGroups = dispatch(loadCampaignAdGroupsAction,
      params.company,
      params.workspace,
      params.folder,
      params.campaign)
      .then(() => this.setState({isLoading: false}))
  },
  extractReport () {
    if (!this.isAdwords) return

    this.setState({creatingReport: true})

    this.loadingAdGroups.then(() => {
      const {campaign, dispatch, params} = this.props

      dispatch(createCampaignAdGroupsReportAction,
        params.company,
        params.workspace,
        params.folder,
        campaign.id,
        campaign.adGroups)
        .then(this.onReportCreated)
    })
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

            <DownloadReportButton
              loading={creatingReport}
              extract={this.extractReport}
              report={campaign.adGroupsReport} />
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
