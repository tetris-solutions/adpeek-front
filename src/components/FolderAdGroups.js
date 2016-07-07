import React from 'react'
import AdGroups from './AdGroups'
import {contextualize} from './higher-order/contextualize'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {loadFolderAdGroupsAction} from '../actions/load-folder-adgroups'
import {createFolderAdGroupsReportAction} from '../actions/create-folder-adgroups-report'
import NotImplemented from './AdGroupsNotImplemented'
import LoadingHorizontal from './LoadingHorizontal'
import DownloadReportButton from './DownloadReportButton'

const {PropTypes} = React

export const FolderAdGroups = React.createClass({
  displayName: 'Campaign',
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
      .then(() => this.setState({isLoading: false}))
  },
  extractReport () {
    if (!this.isAdwords()) return

    this.setState({creatingReport: true})

    this.loadingAdGroups.then(() => {
      const {folder: {adGroups}, dispatch, params} = this.props

      dispatch(createFolderAdGroupsReportAction,
        params.company,
        params.workspace,
        params.folder,
        adGroups)
        .then(this.onReportCreated)
    })
  },
  render () {
    const {creatingReport, isLoading} = this.state
    const {folder} = this.props
    const inner = folder.account.platform === 'adwords'
      ? <AdGroups adGroups={folder.adGroups || []}/>
      : <NotImplemented />

    return (
      <div>
        <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
            <Message folder={folder.name}>folderAdsTitle</Message>
            <div className='mdl-layout-spacer'/>

            <DownloadReportButton
              loading={creatingReport}
              extract={this.extractReport}
              report={folder.adGroupsReport} />
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

export default contextualize(FolderAdGroups, 'folder')
