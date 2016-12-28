import React from 'react'
import AdGroups from './AdGroups'
import {contextualize} from './higher-order/contextualize'
import Message from 'tetris-iso/Message'
import {loadCampaignAdGroupsAction} from '../actions/load-campaign-adgroups'
import NotImplemented from './NotImplemented'
import LoadingHorizontal from './LoadingHorizontal'
import {createCampaignAdGroupsReportAction} from '../actions/create-campaign-adgroups-report'
import DownloadReportButton from './DownloadReportButton'
import SubHeader from './SubHeader'
import Page from './Page'
import flatten from 'lodash/flatten'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import chunk from 'lodash/chunk'
import {loadKeywordsRelevanceAction} from '../actions/load-keywords-relevance'
import CalculateRelevanceButton from './CalculateRelevanceButton'

export function loadKeywordsRelevance () {
  this.setState({calculatingRelevance: true})

  this.loadingAdGroups
    .then(() => {
      const {dispatch, params, campaign, folder} = this.props
      const adGroups = campaign ? campaign.adGroups : folder.adGroups

      const keywordList =
        uniq(flatten(map(adGroups,
          ({keywords}) => map(keywords, 'id'))))

      const chunks = chunk(keywordList, 500)

      let promise = Promise.resolve()

      chunks.forEach(keywords => {
        promise = promise.then(() =>
          dispatch(loadKeywordsRelevanceAction, params, keywords))
      })

      return promise
    })
    .then(() => this.setState({calculatingRelevance: false}))
}

export const CampaignCreatives = React.createClass({
  displayName: 'Campaign-Creatives',
  propTypes: {
    dispatch: React.PropTypes.func,
    campaign: React.PropTypes.shape({
      adGroupsReport: React.PropTypes.shape({
        url: React.PropTypes.string
      }),
      platform: React.PropTypes.string,
      adGroups: React.PropTypes.array
    }),
    params: React.PropTypes.object
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
  onAdGroupsLoaded () {
    const {campaign, dispatch, params} = this.props

    dispatch(createCampaignAdGroupsReportAction,
      params.company,
      params.workspace,
      params.folder,
      campaign.id,
      campaign.adGroups)
      .then(this.onReportCreated)
  },
  extractReport () {
    if (!this.isAdwords()) return

    this.setState({creatingReport: true})

    this.loadingAdGroups
      .then(this.onAdGroupsLoaded)
  },
  loadKeywordsRelevance,
  render () {
    const {creatingReport, isLoading, calculatingRelevance} = this.state
    const {campaign} = this.props
    const inner = campaign.platform === 'adwords'
      ? <AdGroups adGroups={campaign.adGroups}/>
      : <NotImplemented />

    return (
      <div>
        <SubHeader title={<Message>creatives</Message>}>
          <CalculateRelevanceButton
            done={calculatingRelevance === false}
            start={this.loadKeywordsRelevance}
            isCalculating={calculatingRelevance === true}/>

          <DownloadReportButton
            loading={creatingReport}
            extract={this.extractReport}
            report={campaign.adGroupsReport}/>
        </SubHeader>
        <Page>
          {isLoading ? (
            <LoadingHorizontal>
              <Message>loadingAds</Message>
            </LoadingHorizontal>
          ) : inner}
        </Page>
      </div>
    )
  }
})

export default contextualize(CampaignCreatives, 'campaign')
