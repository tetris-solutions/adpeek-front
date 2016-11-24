import React from 'react'
import AdGroups from './AdGroups'
import {contextualize} from './higher-order/contextualize'
import Message from 'tetris-iso/Message'
import {loadFolderAdGroupsAction} from '../actions/load-folder-adgroups'
import {createFolderAdGroupsReportAction} from '../actions/create-folder-adgroups-report'
import NotImplemented from './NotImplemented'
import LoadingHorizontal from './LoadingHorizontal'
import DownloadReportButton from './DownloadReportButton'
import SubHeader from './SubHeader'
import Page from './Page'
import {loadKeywordsRelevance} from './CampaignCreatives'

const {PropTypes} = React

export const FolderCreatives = React.createClass({
  displayName: 'Folder-Creatives',
  propTypes: {
    dispatch: PropTypes.func,
    folder: PropTypes.shape({
      adGroups: PropTypes.array,
      adGroupsReport: PropTypes.shape({
        url: PropTypes.string
      }),
      account: PropTypes.shape({
        platform: PropTypes.string
      }),
      campaigns: PropTypes.array
    }),
    params: PropTypes.object
  },
  getInitialState () {
    return {
      isLoading: this.isAdwords()
    }
  },
  isAdwords () {
    return this.props.folder.account.platform === 'adwords'
  },
  componentDidMount () {
    if (this.isAdwords()) {
      this.loadAdGroups()
    }
  },
  onReportCreated () {
    this.setState({creatingReport: false})

    window.location.href = this.props.folder.adGroupsReport.url
  },
  loadAdGroups () {
    const {params, dispatch} = this.props

    this.loadingAdGroups = dispatch(loadFolderAdGroupsAction,
      params.company,
      params.workspace,
      params.folder)
      .then(this.loadKeywordsRelevance)
  },
  onAdGroupsLoaded () {
    const {folder: {adGroups}, dispatch, params} = this.props

    dispatch(createFolderAdGroupsReportAction,
      params.company,
      params.workspace,
      params.folder,
      adGroups)
      .then(this.onReportCreated)
  },
  extractReport () {
    if (!this.isAdwords()) return

    this.setState({creatingReport: true})

    this.loadingAdGroups.then(this.onAdGroupsLoaded)
  },
  loadKeywordsRelevance,
  render () {
    const {creatingReport, isLoading} = this.state
    const {folder} = this.props
    const inner = folder.account.platform === 'adwords'
      ? <AdGroups adGroups={folder.adGroups}/>
      : <NotImplemented />

    return (
      <div>
        <SubHeader title={<Message>creatives</Message>}>
          <DownloadReportButton
            loading={creatingReport}
            extract={this.extractReport}
            report={folder.adGroupsReport}/>
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

export default contextualize(FolderCreatives, 'folder')
